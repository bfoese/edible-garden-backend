import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { JwtAccountActionTokenPayload } from '../token-payload/jwt-account-action-token-payload.interface';
import { JwtTokenPayload } from '../token-payload/jwt-token-payload.interface';

@Injectable()
export class JwtTokenFactoryService {
  public constructor(private readonly jwtService: JwtService) {}

  /**
   * Must be called for a validated user only.
   * @param user - validated user
   * @returns JwtToken for the user
   */
  public generateAccessToken(payload: JwtTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.BFEG_JWT_SECRET,
      expiresIn: process.env.BFEG_JWT_EXPIRATION_TIME,
    } as JwtSignOptions);
  }

  public generateRefreshToken(payload: JwtTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.BFEG_JWT_REFRESH_SECRET,
      expiresIn: process.env.BFEG_JWT_REFRESH_EXPIRATION_TIME,
    } as JwtSignOptions);
  }

  /**
   * Token is meant for confirming changes on account user data
   * @param username - unique user name
   * @param action - type of action that the token is going to be used for @see JwtAccountActionTokenPayload
   */
  public generateAccountActionToken(payload: JwtAccountActionTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.BFEG_JWT_ACCOUNT_ACTION_SECRET,
      expiresIn: '12h',
    } as JwtSignOptions);
  }
}
