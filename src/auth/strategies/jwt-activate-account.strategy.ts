import authConfig from '@eg-app-config/auth.config';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { JwtAccountActionTokenPayload } from '@eg-auth/token-payload/jwt-account-action-token-payload.interface';
import { User } from '@eg-domain/user/user';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtActivateAccountStrategy extends PassportStrategy(Strategy, 'jwt-activate-account') {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>
  ) {
    super({
      // Refresh token was transferred via cookie
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      // if we are supplied with an expired JWT, the request will be
      // denied and a 401 Unauthorized response sent
      ignoreExpiration: false,
      secretOrKey: _authConfig.jwtAccountActionSecret(),
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
  public async validate(request: Request, payload: JwtAccountActionTokenPayload): Promise<User> {
    // TODO find better way to access the token from the strategy instance
    // instead of reading it here again from the queryParams: thats duplicated
    // logic
    const jwtToken = request.query?.token + '';
    return this.authenticationService.verifyActivateAccountToken(jwtToken, payload);
  }
}
