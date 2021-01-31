import { ApplicationErrorRegistry } from '@eg-app/error/application-error-registry';
import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';
import { JwtAccountActionTokenPayload } from '@eg-auth/token-payload/jwt-account-action-token-payload.interface';
import { JwtUtil } from '@eg-common/util/jwt.util';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { UserValidation } from '@eg-domain/user/user-validation';
import { HashingService } from '@eg-hashing/hashing.service';
import { AccountRegistrationDuplicateAddressJobContext } from '@eg-mail/contracts/account-registration-duplicate-address.jobcontext';
import { AccountRegistrationUserDeletedEmailJobContext } from '@eg-mail/contracts/account-registration-user-deleted-email.jobcontext';
import { MailService } from '@eg-mail/mail.service';
import { LimitTokensPerUserOptions } from '@eg-refresh-token-cache/limit-tokens-per-user.options';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { JwtService } from '@nestjs/jwt';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';

import { AccountActionEmailService } from './account-action-email.service';
import { JwtTokenFactoryService } from './jwt-token-factory.service';

@Injectable()
export class AuthenticationService {
  public static readonly JwtRefreshCookieName = 'JwtRefresh';

  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly refreshTokenCacheService: RefreshTokenCacheService,
    private readonly jwtTokenFactoryService: JwtTokenFactoryService,
    private readonly mailService: MailService,
    private readonly accountActionEmailService: AccountActionEmailService
  ) {}

  /**
   * @param username -
   * @param email -
   * @param password -
   */
  public async register(username: string, email: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    validateOrReject(user, { groups: [UserValidation.groups.userRegistration] } as ValidatorOptions);

    const alreadyRegisteredUser = await this.userService.findByEmail(email);
    if (alreadyRegisteredUser && alreadyRegisteredUser.entityInfo.deleted) {
      // user is marked for deletion
      this.mailService.sendAccountRegistrationUserDeleted({
        usernameForSecondRegistration: user.username,
        recipientEmail: alreadyRegisteredUser.email,
        recipientName: alreadyRegisteredUser.username,
      } as AccountRegistrationUserDeletedEmailJobContext);

      // do not return the user object but throw an error
      throw new HttpException(
        ApplicationErrorRegistry.ActionDeniedConsultEmailAccount.getMessage(),
        HttpStatus.BAD_REQUEST
      );
    }

    if (alreadyRegisteredUser) {
      // user already registered with that email and is not deleted
      // don't override the already registered user object with the new data
      // send an account reminder email to user
      // in case the account is not activated yet, create a new activation token and include it in the email
      const isAccountActivated = alreadyRegisteredUser.isAccountActivated();

      const emailContext: AccountRegistrationDuplicateAddressJobContext = {
        usernameForSecondRegistration: user.username,
        recipientEmail: alreadyRegisteredUser.email,
        recipientName: alreadyRegisteredUser.username,
        showAccountActivationLink: !isAccountActivated,
      };

      if (!isAccountActivated) {
        const accountActionPurpose: AccountActionPurpose = 'ActivateAccount';
        const accountActivationToken: string = this.jwtTokenFactoryService.generateAccountActionToken({
          sub: alreadyRegisteredUser?.username ?? user.username,
          purpose: accountActionPurpose,
        });
        const encryptedAccountActivationToken: string = await this.hashingService.createSaltedHash(
          accountActivationToken
        );
        const accountActivationUrl = this.accountActionEmailService.getAccountActionUrl(
          accountActionPurpose,
          accountActivationToken
        );

        emailContext.accountActivationUrl = accountActivationUrl;

        // update activation token on user object
        alreadyRegisteredUser.accountActionToken = encryptedAccountActivationToken;
        const updateRegisteredUserData = {
          accountActionToken: encryptedAccountActivationToken,
          entityInfo: { id: alreadyRegisteredUser.entityInfo.id },
        } as User;
        this.userService.save(updateRegisteredUserData);
      }
      this.mailService.sendAccountRegistrationDuplicateAddress(emailContext);
      throw new HttpException(
        ApplicationErrorRegistry.ActionDeniedConsultEmailAccount.getMessage(),
        HttpStatus.BAD_REQUEST
      );
    } else {
      // this is really a completely new user
      // create an inactive account for the user and send an activation email
      const hashedPassword: string = await this.hashingService.createSaltedPepperedHash(user.password);
      user.password = hashedPassword; // override the plain text password with hashed one
      user.entityInfo.isActive = false; // do not activate account yet

      const createdUser = await this.userService.create(user);
      this.accountActionEmailService.sendAccountActionEmail('ActivateAccount', createdUser.email);
      return createdUser;
    }
  }

  /**
   * Will check the validty of the provided token by checking if we have this token stored in the database for the user.
   * We don't need to perform expiration checks over here as this is done by passport-jwt strategy. Its more of a business rule check.
   * @param jwtToken - JWT for account action confirmation
   * @param payload - already decoded payload from that token
   */
  public async verifyActivateAccountToken(
    jwtToken: string,
    payload: JwtAccountActionTokenPayload
  ): Promise<User | null> {
    if (jwtToken && payload?.purpose === 'ActivateAccount') {
      const user = await this.userService.findByUsernameOrEmail(payload.sub);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.entityInfo.deleted) {
        throw new HttpException(
          ApplicationErrorRegistry.ActionDeniedUserSoftDeleted.getMessage(user.username),
          HttpStatus.FORBIDDEN
        );
      }

      if (user.isAccountActivated()) {
        // could happen if user clicks the activation link multiple time. maybe
        // better to return the user instead of throwing exception. should be
        // safe because we queried the user from the jwt sub field and
        // passport-jwt validated the signature of the token
        return user;
      }

      // by design we store only one accountAtionToken. In the future there are
      // other use cases beside activation where such a token is needed to be
      // stored on the user. but the general idea is, that the user performs
      // these actions sequentially and not in parallel and these action tokens
      // can be considered one-time-tokens
      const userAccountActionToken = user.accountActionToken;
      // the token in the database was hashed for security reasons
      const matchingToken = userAccountActionToken
        ? await this.hashingService.verifyUnpepperedHash(jwtToken, userAccountActionToken)
        : false;

      if (matchingToken) {
        return user;
      }
    }
    return Promise.resolve(null);
  }

  public activateAccount(user: User): Promise<User> {
    return this.userService.activateAccount(user.username);
  }

  public deleteAccount(email: string): Promise<boolean> {
    return this.userService.deleteAccountPermanently(email);
  }

  /**
   * Finds the user for the given credentials. If no user of the given name was
   * found or the provided password does not match the stored password of that
   * user, an error will be thrown that does NOT exposes details whether the
   * given user existed or not for security reasons.
   *
   * @param usernameOrEmail - name or email of the user
   * @param plainTextPassword - password of the user in plain text
   * @throws HttpException
   */
  public async validateLoginCredentials(usernameOrEmail: string, plainTextPassword: string): Promise<User> {
    const hashedPassword = await this.userService.getPasswordFromUser(usernameOrEmail);
    const passwordMatches = hashedPassword
      ? await this.hashingService.verifyPepperedHash(plainTextPassword, hashedPassword)
      : false;
    if (passwordMatches) {
      const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
      if (user.isAccountMarkedForDeletion()) {
        throw new HttpException(
          ApplicationErrorRegistry.InvalidUserNameOrPassword.getMessage(usernameOrEmail),
          HttpStatus.UNAUTHORIZED
        );
      }
      if (!user.isAccountActivated()) {
        throw new HttpException(
          ApplicationErrorRegistry.ActionDeniedAccountNotActivated.getMessage(),
          HttpStatus.UNAUTHORIZED
        );
      }
      return user;
    }
    throw new HttpException(
      ApplicationErrorRegistry.InvalidUserNameOrPassword.getMessage(usernameOrEmail),
      HttpStatus.UNAUTHORIZED
    );
  }

  public async generateNextRefreshToken(user: User, previousRefreshToken: string): Promise<string> {
    const refreshToken = this.jwtTokenFactoryService.generateRefreshToken({ sub: user.username });
    if (previousRefreshToken) {
      // invalidate the old token by removing it
      this.refreshTokenCacheService.removeOne(user.username, previousRefreshToken);
    }
    this.refreshTokenCacheService.add(user.username, refreshToken, {
      maxNoOfTokens: 5,
      maxNoOfTokensReducer: (prev: string, curr: string) => this.removeOldestJwtReducer(prev, curr),
    } as LimitTokensPerUserOptions);
    return refreshToken;
  }

  /**
   * Must be called for a validated user only.
   * @param user - validated user
   * @returns JwtToken for the user
   */
  public generateAccessToken(user: User): Promise<string> {
    return Promise.resolve(this.jwtTokenFactoryService.generateAccessToken({ sub: user.username }));
  }

  /**
   * Server deletes all refresh tokens from the user. The user will not be
   * immediately logged out on all devices with that, because some of the issued
   * JWT tokens may still be valid. But as soon as they expire and these devices
   * try to make a refresh request with their refresh tokens, the server does
   * not know these refresh tokens anymore and will deny the requests and
   * therefore force the user to login with these devices again.
   * @param user -
   */
  public async logout(user: User): Promise<boolean> {
    this.refreshTokenCacheService.removeAll(user.username);
    return Promise.resolve(true);
  }

  /**
   * Identifies the JWT with the earliest "issued at" timestamp from the given list of tokens
   * @param tokens - Array of JWT token strings
   */
  private removeOldestJwtReducer(previous: string, current: string): string {
    return this.getValueFromJwt(JwtUtil.registeredClaims.iat, previous) ??
      0 < this.getValueFromJwt(JwtUtil.registeredClaims.iat, current) ??
      0
      ? previous
      : current;
  }

  /**
   * Decodes and extracts the 'iat' (Issued at) field value from the given token
   * @param key - Key within the decoded JWT JSON
   * @param token - JWT token
   */
  private getValueFromJwt(key: string, token: string): number | null {
    let payload;
    try {
      payload = token ? this.jwtService.decode(token) : null;
    } catch (error) {
      console.error(error);
    }
    return payload ? payload[key] : null;
  }

  public getJwtExpirationDate(token: string): Date | null {
    const expirationTime = this.getValueFromJwt(JwtUtil.registeredClaims.exp, token);
    if (expirationTime != null) {
      return JwtUtil.jwtTimestampToDate(expirationTime);
    }
    return null; // no time defined
  }

  public static getJwtRefreshCookie(request: Request): string {
    const signedCookies = request?.signedCookies;
    return signedCookies ? signedCookies[AuthenticationService.JwtRefreshCookieName] : null;
  }
}