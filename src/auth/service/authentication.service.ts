import { ApplicationErrorRegistry } from '@eg-app/error/application-error-registry';
import { ValidationException } from '@eg-app/exception/validation.exception';
import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';
import { JwtAccountActionTokenPayload } from '@eg-auth/token-payload/jwt-account-action-token-payload.interface';
import { JwtUtil } from '@eg-common/util/jwt.util';
import { UserService } from '@eg-data-access/user/user.service';
import { ExternalAuthProvider } from '@eg-domain/user/external-auth-provider.enum';
import { User } from '@eg-domain/user/user';
import { UserFindOptions } from '@eg-domain/user/user-find-options';
import { UserValidation } from '@eg-domain/user/user-validation';
import { HashingService } from '@eg-hashing/hashing.service';
import { AccountRegistrationDuplicateAddressJobContext as AccountSignupDuplicateAddressJobContext } from '@eg-mail/contracts/account-registration-duplicate-address.jobcontext';
import { AccountRegistrationUserDeletedEmailJobContext } from '@eg-mail/contracts/account-registration-user-deleted-email.jobcontext';
import { MailService } from '@eg-mail/mail.service';
import { LimitTokensPerUserOptions } from '@eg-refresh-token-cache/limit-tokens-per-user.options';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { JwtService } from '@nestjs/jwt';
import { validateOrReject, ValidationError } from 'class-validator';
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
  public async signup(username: string, email: string, password: string, preferredLocale: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.preferredLocale = preferredLocale;

    await validateOrReject(user, {
      groups: [UserValidation.groups.userRegistration],
    } as ValidatorOptions).catch((errors: ValidationError[]) => {
      throw new ValidationException(errors);
    });

    const alreadyRegisteredUser = await this.userService.findByEmail(email, {
      withHiddenFields: {
        email: true,
      },
    } as UserFindOptions);
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
      // user already registered with that email and is not deleted don't
      // override the already registered user object with the new data send a
      // reminder email to user in case the email is not yet verified, create a
      // new verification token and include it in the email
      const isEmailVerified = alreadyRegisteredUser.isEmailVerified;

      const emailContext: AccountSignupDuplicateAddressJobContext = {
        usernameForSecondRegistration: user.username,
        recipientEmail: alreadyRegisteredUser.email,
        recipientName: alreadyRegisteredUser.username,
        showVerifyEmailLink: !isEmailVerified,
        locale: preferredLocale,
      };

      if (!isEmailVerified) {
        const accountActionPurpose: AccountActionPurpose = 'VerifyEmailSignup';
        const accountActivationToken: string = this.jwtTokenFactoryService.generateAccountActionToken(
          alreadyRegisteredUser ? alreadyRegisteredUser : user,
          accountActionPurpose
        );
        const accountActivationUrl = this.accountActionEmailService.getAccountActionUrl(
          accountActionPurpose,
          accountActivationToken
        );

        emailContext.accountActivationUrl = accountActivationUrl;

        // update activation token on user object
        const updateRegisteredUserData = {
          accountActionToken: accountActivationToken,
          entityInfo: { id: alreadyRegisteredUser.entityInfo.id },
        } as User;
        this.userService.save(updateRegisteredUserData);
      }
      this.mailService.sendAccountSignupDuplicateAddress(emailContext);
      throw new HttpException(
        ApplicationErrorRegistry.ActionDeniedConsultEmailAccount.getMessage(),
        HttpStatus.BAD_REQUEST
      );
    } else {
      // this is really a completely new user
      // create an inactive account for the user and send an activation email
      user.password = await this.hashUserPassword(user.password); // override the plain text password with hashed one
      user.entityInfo.isActive = true; // this flag is used to block accounts
      user.isEmailVerified = false; // prevents the user from signin until email is verified

      const createdUser = await this.userService.create(user);
      this.accountActionEmailService.sendAccountActionEmail('VerifyEmailSignup', createdUser.email);
      return createdUser;
    }
  }

  private async hashUserPassword(plainTextPassword: string): Promise<string | undefined> {
    return plainTextPassword ?  await this.hashingService.createSaltedPepperedHash(plainTextPassword) : undefined;
  }

  public async signupOrUpdateExtAuthProviderUser(
    extAuthProvider: ExternalAuthProvider,
    externalUserId: string,
    email: string,
    username: string,
    preferredLocale: string
  ): Promise<User | undefined> {
    const user = await this.userService.findByExtAuthProviderId(extAuthProvider, externalUserId, {
      withHiddenFields: {
        email: true,
      },
    } as UserFindOptions);

    if (user) {
      // user data on provider side might have changed: update our user if necessary
      const changedFields = {} as User;
      if (user.email !== email) {
        changedFields.email = email;
      }
      if (user.username !== username) {
        changedFields.username = username;
      }
      if (user.preferredLocale !== preferredLocale) {
        changedFields.preferredLocale = preferredLocale;
      }
      if (Object.keys(changedFields).length > 0) {
        const newData = { entityInfo: { id: user.entityInfo.id }, ...changedFields } as User;
        await this.userService.save(newData);
      }
      return user;
    } else {
      const user = new User();
      user.email = email;
      user.extAuthProvider = extAuthProvider;
      user.extAuthProviderUserId = externalUserId;
      user.username = username;
      user.preferredLocale = preferredLocale;

      // actually Goolge provides information if email is verified or not, but
      // at this point I will ignore it and always consider email of external
      // auth provider as being verified
      user.isEmailVerified = true;

      this.userService.create(user);
    }
    return user;
  }

  /**
   * Will check the validty of the provided token by checking if we have this
   * token stored in the database for the user. We don't need to perform
   * expiration checks over here as this is done by passport-jwt strategy. Its
   * more of a business rule check.
   * @param jwtToken - JWT for account action confirmation
   * @param payload - already decoded payload from that token
   */
  public async verifySecureAccountActionToken(
    jwtToken: string,
    payload: JwtAccountActionTokenPayload
  ): Promise<User | null> {
    if (jwtToken) {
      const userId = this.jwtTokenFactoryService.getUserIdFromPayload(payload);

      const user = await this.userService.findById(userId, {
        withHiddenFields: { accountActionToken: true },
      } as UserFindOptions);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const purpose = payload?.purpose;

      if (purpose === 'VerifiyEmailUpdate' || purpose === 'VerifyEmailSignup') {
        if (user.isEmailVerified) {
          // could happen if user clicks the link multiple times. Maybe
          // better to return the user instead of throwing exception. should be
          // safe because we queried the user from the jwt sub field and
          // passport-jwt validated the signature of the token
          return user;
        }
      }

      if (purpose === 'ResetPassword' && user.extAuthProvider) {
        throw new HttpException('Not allowed for third party auth provider account', HttpStatus.BAD_REQUEST);
      }

      // By design we store only one accountActionToken. The general idea is,
      // that the user performs these actions sequentially and not in parallel
      // and these action tokens can be considered to be one-time-tokens
      const userAccountActionToken = user.accountActionToken;
      // the token in the database was hashed for security reasons
      const matchingToken = userAccountActionToken === jwtToken
      if (matchingToken) {
        return user;
      }
    }
    return Promise.resolve(null);
  }

  public verifyEmail(user: User): Promise<User> {
    return this.userService.verifyEmail(user.entityInfo.id);
  }

  public async changePassword(userId: string, plainTextPassword: string, _token: string): Promise<User> {

    const validationObj = {password: plainTextPassword} as User;

    await validateOrReject(validationObj, {
      groups: [UserValidation.groups.userRegistration],
    } as ValidatorOptions).catch((errors: ValidationError[]) => {
      throw new ValidationException(errors);
    });

    const hashedPassword = await this.hashUserPassword(plainTextPassword)
    return this.userService.changePassword(userId, hashedPassword);
  }

  public deleteAccount(userId: string): Promise<boolean> {
    return this.userService.deleteAccountPermanently(userId);
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

      if (!user.isEmailVerified) {
        throw new HttpException(
          ApplicationErrorRegistry.ActionDeniedEmailVerificationRequired.getMessage(),
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

  private async generateNextRefreshToken(user: User, previousRefreshToken: string): Promise<string> {
    const refreshToken = this.jwtTokenFactoryService.generateRefreshToken(user);
    if (previousRefreshToken) {
      // invalidate the old token by removing it
      this.refreshTokenCacheService.removeOne(user.entityInfo.id, previousRefreshToken);
    }
    this.refreshTokenCacheService.add(user.entityInfo.id, refreshToken, {
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
  private generateAccessToken(user: User): Promise<string> {
    return Promise.resolve(this.jwtTokenFactoryService.generateAccessToken(user));
  }

  public async refresh(request: Request, user: User): Promise<string> {
    if (user) {
      const previousRefreshToken = AuthenticationService.getJwtRefreshCookie(request);
      const accessToken = this.generateAccessToken(user);
      await this.addRefreshTokenCookie(request, previousRefreshToken, user);
      return accessToken;
    }
    return null;
  }

  public async signin(request: Request, user: User): Promise<string> {
    if (user) {
      const accessToken = this.generateAccessToken(user);
      await this.addRefreshTokenCookie(request, null, user);
      return accessToken;
    }
    return null;
  }

  /**
   * Server deletes only the refresh tokens from the given request. The user
   * will only be logged out in applications, where this refresh token was used:
   * probably only the tabs within one browser window on one device. The user
   * should be immediately logged out in this browser, as we also remove the
   * refresh cookie.
   * @param request -
   * @param user -
   */
  public async signout(request: Request, user: User): Promise<boolean> {
    const previousRefreshToken = AuthenticationService.getJwtRefreshCookie(request);
    this.refreshTokenCacheService.removeOne(user?.entityInfo?.id, previousRefreshToken);
    request.res.clearCookie(AuthenticationService.JwtRefreshCookieName);
    return Promise.resolve(true);
  }

  private async addRefreshTokenCookie(request: Request, previousRefreshToken: string, user: User): Promise<void> {
    const refreshToken = await this.generateNextRefreshToken(user, previousRefreshToken);
    request.res.cookie(AuthenticationService.JwtRefreshCookieName, refreshToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      sameSite: true,
      expires: this.getJwtExpirationDate(refreshToken),
    });
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
  public async logoutFromAllDevices(request: Request, user: User): Promise<boolean> {
    this.refreshTokenCacheService.removeAll(user.entityInfo.id);
    request.res.clearCookie(AuthenticationService.JwtRefreshCookieName);
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
