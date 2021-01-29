import authConfig from '@eg-app-config/auth.config';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtTokenPayload } from '../token-payload/jwt-token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
    private userService: UserService
  ) {
    super({
      // We use the standard approach of supplying a bearer token in the
      // Authorization header of our API requests
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // if our route is supplied with an expired JWT, the request will be
      // denied and a 401 Unauthorized response sent
      ignoreExpiration: false,
      secretOrKey: _authConfig.jwtSecret(),
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
  public async validate(payload: JwtTokenPayload): Promise<User> {
    const user = await this.userService.findByUsernameOrEmail(payload.sub);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
