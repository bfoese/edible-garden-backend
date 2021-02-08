import authConfig from '@eg-app-config/auth.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { JwtAccountActionTokenPayload } from '../token-payload/jwt-account-action-token-payload.interface';
import { JwtTokenPayload } from '../token-payload/jwt-token-payload.interface';

@Injectable()
export class JwtTokenFactoryService {
  public constructor(
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Must be called for a validated user only.
   * @param user - validated user
   * @returns JwtToken for the user
   */
  public generateAccessToken(payload: JwtTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtSecret(),
      expiresIn: this._authConfig.jwtExpirationTime(),
    } as JwtSignOptions);
  }

  public generateRefreshToken(payload: JwtTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtRefreshSecret(),
      expiresIn: this._authConfig.jwtRefreshExpirationTime(),
    } as JwtSignOptions);
  }

  /**
   * Token is meant for confirming changes on account user data
   * @param username - unique user name
   * @param action - type of action that the token is going to be used for @see JwtAccountActionTokenPayload
   */
  public generateAccountActionToken(payload: JwtAccountActionTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtAccountActionSecret(),
      expiresIn: '12h',
    } as JwtSignOptions);
  }
}
