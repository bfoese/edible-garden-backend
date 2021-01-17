import { AuthenticationService } from '@eg-auth/authentication.service';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtTokenPayload } from './jwt-token-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  public constructor(
    private readonly userService: UserService,
    private readonly refreshTokenCacheService: RefreshTokenCacheService
  ) {
    super({
      // Refresh token was transferred via cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): any => {
          return AuthenticationService.getJwtRefreshCookie(request);
        },
      ]),
      // if our route is supplied with an expired JWT, the request will be
      // denied and a 401 Unauthorized response sent
      ignoreExpiration: false,
      secretOrKey: process.env.BFEG_JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * Passport first verifies the JWT signature and decodes the payload. It then
   * invokes this validate() method passing the decoded payload as its single
   * parameter.
   *
   * @param payload - This will be passed by Passport and we are guaranteed to
   * receive here a valid token that we have previously signed and issued to a
   * valid user.
   * @returns - The return value of this method will be used by Passport to
   * build a 'user' object and attach it as a property on the Request object.
   *
   */
  public async validate(request: Request, payload: JwtTokenPayload): Promise<User> {
    const refreshToken = AuthenticationService.getJwtRefreshCookie(request);

    if (refreshToken) {
      const user = await this.userService.findByUsernameOrEmail(payload.sub);
      const tokenBelongsToUser = await this.refreshTokenCacheService.contains(user.username, refreshToken);
      if (tokenBelongsToUser) {
        return user;
      }
    }
    return null;
  }
}