import authConfig from '@eg-app-config/auth.config';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { JwtAccountActionTokenPayload } from '@eg-auth/token-payload/jwt-account-action-token-payload.interface';
import { User } from '@eg-domain/user/user';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

/**
 * Strategy to implement secure actions on sensitive user account data (e.g.
 * account activation, account deletion, reset password). The idea is, that for
 * each of these account actions a JWT token will be generated and sent to the
 * users email address in form of a one-time link. When the user clicks on that
 * link, this strategy kicks in and verifies if the JWT token is present and
 * valid. If so, the token payload will tell which action should be performed so
 * that we can call different implementations from this strategy.
 */
@Injectable()
export class SecureAccountActionStrategy extends PassportStrategy(Strategy, 'secure-account-action') {

  private static jwtFromRequestFunction: JwtFromRequestFunction = (request: Request) => {
    return ExtractJwt.fromUrlQueryParameter('token')(request) ?? ExtractJwt.fromBodyField('token')(request);
  };

  public constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>
  ) {
    super({
      jwtFromRequest: SecureAccountActionStrategy.jwtFromRequestFunction,
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
   */
  public async validate(request: Request, payload: JwtAccountActionTokenPayload): Promise<User> {
    const jwtToken = SecureAccountActionStrategy.jwtFromRequestFunction(request);
    return this.authenticationService.verifySecureAccountActionToken(jwtToken, payload);
  }
}
