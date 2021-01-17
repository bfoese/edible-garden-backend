import { JwtUtil } from '@eg-common/util/jwt.util';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { HashingService } from '@eg-hashing/hashing.service';
import { LimitTokensPerUserOptions } from '@eg-refresh-token-cache/limit-tokens-per-user.options';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request } from 'express';

import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { JwtTokenPayload } from './strategies/jwt-token-payload.interface';

@Injectable()
export class AuthenticationService {
  public static readonly JwtRefreshCookieName = 'JwtRefresh';

  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly refreshTokenCacheService: RefreshTokenCacheService
  ) {}

  /**
   * @param user -
   */
  public async register(user: User): Promise<User> {
    const hashedPassword = await this.hashingService.createSaltedPepperedHash(user.password);
    const createdUser = await this.userService.create({
      ...user,
      password: hashedPassword, // override the plain text password with hashed one
    });
    return createdUser;
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
    const passwordMatches = await this.hashingService.verifyHash(plainTextPassword, password);
    if (passwordMatches) {
      return this.userService.findByUsernameOrEmail(usernameOrEmail);
    }
    throw new InvalidCredentialsException(usernameOrEmail);
  }

  public async generateNextRefreshToken(user: User, previousRefreshToken: string): Promise<string> {
    const payload = { sub: user.username } as JwtTokenPayload;
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.BFEG_JWT_REFRESH_SECRET,
      expiresIn: process.env.BFEG_JWT_REFRESH_EXPIRATION_TIME,
    } as JwtSignOptions);

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
    const payload = { sub: user.username } as JwtTokenPayload;
    // had to provide secret and expiration time here again, even though its
    // configured already for the imported JwtModule - don't know why,
    // whithout it, no secret was found
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.BFEG_JWT_SECRET,
      expiresIn: process.env.BFEG_JWT_EXPIRATION_TIME,
    } as JwtSignOptions);
    return Promise.resolve(accessToken);
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
