import authConfig from '@eg-app-config/auth.config';
import { AuthenticationFacadeService } from '@eg-auth/presentation/facade/authentication-facade.service';
import { ArrayUtils } from '@eg-common/util/array.utils';
import { ExternalAuthProvider } from '@eg-domain/user/external-auth-provider.enum';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

type GoogleUserPhoto = { value: string; };
type GoogleUserEmail = { value: string; verified: boolean; };
type GoogleUserProfile = {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string; };
  photos: GoogleUserPhoto[];
  emails: GoogleUserEmail[];
};


/**
 * One challenge for this strategy was, how to access the preferred locale of
 * the user. Couldn't use an injection token in the controller method, as the
 * passport strategy guard will be performed before. The locale resolver can't
 * used from within the strategy, as it would need a NestJS ExecutionContext,
 * but passport only gives access to the HTTP part of the ExecutionContext,
 * which is the HttpRequest. Second idea was to read the locale header, that is
 * set by the client, but in this case, the client opens the auth request from a
 * new window and can't set headers. Another option would be that the client
 * sends the locale as a query param. This would be technically possible, but
 * but as it turned out, the validate method will get the request from the
 * google redirect this request object does not have the original URL and query
 * parameters anymore. So no solution found which requires the frontend to make
 * a separate call to set the locale for the user.
 *
 * Here are infos concerning the ExcecutionContext in passport strategies:
 * https://github.com/nestjs/passport/issues/8
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-auth') {
  private readonly logger = new Logger(GoogleStrategy.name);

  public constructor(
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
    private readonly authFacadeService: AuthenticationFacadeService,
  ) {
    super({
      clientID: _authConfig.googleAuthClientId(),
      clientSecret: _authConfig.googleAuthClientSecret(),
      callbackURL: _authConfig.googleAuthRedirectUri(),
      passReqToCallback: true, // enables to see the request in validate method
      // available scopes: https://developers.google.com/identity/protocols/oauth2/scopes#oauth2
      scope: ['profile', 'email'],
    });
  }

  /**
   * @param _request -
   * @param _accessToken - Can be used to access Google APIs, not needed for us
   * @param _refreshToken - Can be used to access Google APIs, not needed for us
   * @param profile - Users Google account public profile information
   * @param done -
   */
  public async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleUserProfile,
    done: (err, User) => any
  ): Promise<void> {
    if (!profile) {
      done(null, false);
    }
    try {
      // TODO At this point I don't know what the different email addresses are.
      // I just take the first. Google even gives information if the email
      // address is verified or not. I ignore that for now. Could be refined in the future.
      const email = ArrayUtils.isNotEmpty(profile.emails) ? profile.emails[0].value : undefined;
      const user = await this.authFacadeService.signupOrUpdateExtAuthProviderUser(
        ExternalAuthProvider.Google,
        profile.id,
        email,
        profile.displayName,
        // didn't found a way to access the preferred locale du to lack of
        // ExecutionContext in the strategy. The fronted must make a separate
        // call to update the preferred locale.
        undefined
      );
      done(null, user);
    } catch (err) {
      this.logger.error(err);
      done(err, false);
    }
  }
}
