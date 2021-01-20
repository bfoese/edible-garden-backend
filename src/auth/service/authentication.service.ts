import appConfig from '@eg-app-config/app.config';
import { JwtAccountActionTokenPayload } from '@eg-auth/token-payload/jwt-account-action-token-payload.interface';
import { JwtUtil } from '@eg-common/util/jwt.util';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { UserValidation } from '@eg-domain/user/user-validation';
import { HashingService } from '@eg-hashing/hashing.service';
import { AccountActivationEmailJobData } from '@eg-mail/contracts/account-activation-email-job-data.interface';
import { MailService } from '@eg-mail/mail.service';
import { LimitTokensPerUserOptions } from '@eg-refresh-token-cache/limit-tokens-per-user.options';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';

import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { JwtTokenFactoryService } from './jwt-token-factory.service';

@Injectable()
export class AuthenticationService {
  public static readonly JwtRefreshCookieName = 'JwtRefresh';

  public constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly refreshTokenCacheService: RefreshTokenCacheService,
    private readonly jwtTokenFactoryService: JwtTokenFactoryService,
    private readonly mailService: MailService
  ) {}

  /**
   * TODO instead of returning the user object, I would like to return a
   * localized message indicating that registration was successful and the user
   * received an account activation mail. So the frontend does not need to
   * hardcode the message itself.
   *
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

    const accountActionToken: string = this.jwtTokenFactoryService.generateAccountActionToken({
      sub: user.username,
      action: 'ActivateAccount',
    });
    const hashedAccountActionToken: string = await this.hashingService.createSaltedHash(accountActionToken);

    const hashedPassword: string = await this.hashingService.createSaltedPepperedHash(user.password);
    user.password = hashedPassword; // override the plain text password with hashed one
    user.entityInfo.isActive = false; // do not activate account yet
    user.accountActionToken = hashedAccountActionToken; // we hash the token for the database in case the database get leaked
    const createdUser = await this.userService.create(user);
    const emailJobData: AccountActivationEmailJobData = {
      recipientName: user.username,
      recipientEmail: user.email,
      accountActivationUrl: `${this._appConfig.serverUrl()}/edible-garden/auth/activate?token=${accountActionToken}`,
    };
    this.mailService.sendAccountActivationEmail(emailJobData); // don't wait for finishing
    return createdUser;
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
    if (jwtToken && payload?.action === 'ActivateAccount') {
      const user = await this.userService.findByUsernameOrEmail(payload.sub);

      if (!user || user.entityInfo.deleted) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user || user.entityInfo.deleted) {
        throw new HttpException('Account is marked for deletion', HttpStatus.FORBIDDEN);
      }

      if (user.entityInfo.isActive) {
        throw new HttpException('Account is already activated', HttpStatus.FORBIDDEN);
      }

      const userAccountActionToken = user.accountActionToken;
      // the token in the database was hashed for security reasons
      const matchingToken = userAccountActionToken
        ? await this.hashingService.verifyUnpepperedHash(jwtToken, userAccountActionToken)
        : false;

      if (matchingToken){
        return user;
      }
    }
    return Promise.resolve(null);
  }

  public activateAccount(user: User): Promise<User> {
    return this.userService.activateAccount(user.username);
  }

  /**
   * Finds the user for the given credentials. If no user of the given name was
   * found or the provided password does not match the stored password of that
   * user, an error will be thrown that does NOT exposes details whether the
   * given user existed or not for security reasons.
   *
   * @param usernameOrEmail - name or email of the user
   * @param plainTextPassword - password of the user in plain text
   */
  public async validateUser(usernameOrEmail: string, plainTextPassword: string): Promise<User | undefined> {
    const password = await this.userService.getPasswordFromUser(usernameOrEmail);
    const passwordMatches = await this.hashingService.verifyPepperedHash(plainTextPassword, password);
    if (passwordMatches) {
      return this.userService.findByUsernameOrEmail(usernameOrEmail);
    }
    throw new InvalidCredentialsException(usernameOrEmail);
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
