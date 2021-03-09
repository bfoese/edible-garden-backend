import authConfig from '@eg-app-config/auth.config';
import { CryptoService } from '@eg-app/crypto/crypto.service';
import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';
import { User } from '@eg-domain/user/user';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { JwtTokenPayload } from '../token-payload/jwt-token-payload.interface';

@Injectable()
export class JwtTokenFactoryService {
  public constructor(
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private cryptoService: CryptoService
  ) {}

  /**
   * Must be called for a validated user only.
   * @param user - validated user
   * @returns JwtToken for the user
   */
  public generateAccessToken(user: User): string {
    const payload = this.createPayloadForUser(user);
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtSecret(),
      expiresIn: this._authConfig.jwtExpirationTime(),
    } as JwtSignOptions);
  }

  public generateRefreshToken(user: User): string {
    const payload = this.createPayloadForUser(user);
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
  public generateAccountActionToken(user: User, purpose: AccountActionPurpose): string {
    const payload = { ...this.createPayloadForUser(user), purpose: purpose } as JwtTokenPayload;
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtAccountActionSecret(),
      expiresIn: '12h',
    } as JwtSignOptions);
  }

  public getUserIdFromPayload(payload: JwtTokenPayload): string | undefined {
    const sub = payload?.sub;
    if (sub) {
      return this.cryptoService.deterministicDecryption(sub);
    }
    return undefined;
  }

  /**
   * The payload sub field will contain the userId from the database. To
   * minimize the attack vector, we encrypt the ID for the payload, since the
   * payload can be read in clear text.
   *
   * @param user - User for whom the JWT is being generated
   */
  private createPayloadForUser(user: User): JwtTokenPayload {
    const userId = user.entityInfo.id;
    const encryptedUserId = this.cryptoService.deterministicEncryption(userId);
    const payload = { sub: encryptedUserId } as JwtTokenPayload;
    return payload;
  }
}
