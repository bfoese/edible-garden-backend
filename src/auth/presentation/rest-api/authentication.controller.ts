import authConfig from '@eg-app/config/auth.config';
import { AuthRouteConstants } from '@eg-auth/constants/auth-route-constants';
import { Public } from '@eg-auth/decorators/public-endpoint.decorator';
import { GoogleAuthGuard } from '@eg-auth/guards/google-auth.guard';
import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@eg-auth/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '@eg-auth/guards/local-authentication.guard';
import { SecureAccountActionGuard } from '@eg-auth/guards/secure-account-action.guard';
import { RequestWithUser } from '@eg-auth/strategies/request-with-user';
import { User } from '@eg-domain/user/user';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthenticationFacadeService } from '../facade/authentication-facade.service';
import { PatchPasswordDto } from '../facade/dto/patch-password.dto';
import { SendAccountActionLinkDto } from '../facade/dto/send-account-action-link.dto';
import { SigninResponseDto } from '../facade/dto/signin-response.dto';
import { SigninUserDto } from '../facade/dto/signin-user.dto';
import { SignupUserDto } from '../facade/dto/signup-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  public constructor(
    private readonly authenticationFacadeService: AuthenticationFacadeService,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>
  ) {}

  /**
   * Request account activation email, reset password email, delete account
   * email to be send to the users email account.
   *
   * @param dto - containing user data and type of email to be send
   */
  @HttpCode(204)
  @Public()
  @Post('account-action-email')
  public sendAccountActionEmail(@Body() dto: SendAccountActionLinkDto): Promise<void> {
    return this.authenticationFacadeService.sendAccountActionEmail(dto);
  }

  /**
   * Register a new user account
   * @param dto - user data
   */
  @Public()
  @Post('signup')
  public signup(@Body() dto: SignupUserDto): Promise<boolean> {
    return this.authenticationFacadeService.signup(dto);
  }

  @Public()
  @UseGuards(SecureAccountActionGuard)
  @Get(AuthRouteConstants.Path_VerifyEmail)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async verifyEmail(
    @Req() request: RequestWithUser,
    @Query(AuthRouteConstants.QueryParam_Token) _token: string,
    @Res() response: Response
  ): Promise<any> {
    const user = await request.user;

    if (!user) {
      response
        .status(302)
        .redirect(
          this.buildFrontendUri(
            this._authConfig.frontendFeedbackPathInvalidTokenVerifyEmail(this.getFrontendLocale(user))
          )
        );
    } else {
      const result = await this.authenticationFacadeService.verifyEmail(user);
      const success = result?.isEmailVerified;
      response
        .status(302)
        .redirect(
          this.buildFrontendUri(
            this._authConfig.frontendFeedbackPathEmailVerified(this.getFrontendLocale(user), success)
          )
        );
    }
  }

  /**
   * This is a GET even though there will be a change performed. This request
   * will show up within an Email. Using a POST with a form and submit button in
   * the Email might cause a popup to show up or even worse a popup being
   * blocked. For more inexperienced users the link with the GET request is
   * better.
   * @param request -
   * @param _token - JWT from the Email to allow account activation
   */
  @UseGuards(SecureAccountActionGuard)
  @Get(AuthRouteConstants.Path_DeleteAccount)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteAccount(
    @Req() request: RequestWithUser,
    @Query(AuthRouteConstants.QueryParam_Token) _token: string,
    @Res() response: Response
  ): Promise<any> {
    const user = await request.user;
    // in case of token validation errors, the user will be user=false
    const accountDeleted = user ? await this.authenticationFacadeService.deleteAccount(user) : false;
    response
      .status(302)
      .redirect(
        this.buildFrontendUri(
          this._authConfig.frontendFeedbackPathAccountDeleted(this.getFrontendLocale(user), accountDeleted)
        )
      );
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refresh(@Req() request: RequestWithUser): Promise<SigninResponseDto | void> {
    const user = await request.user;
    return await this.authenticationFacadeService.refresh(request, user);
  }

  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthenticationGuard)
  @Post('signin')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async signin(@Req() request: RequestWithUser, @Body() _signinData: SigninUserDto): Promise<SigninResponseDto> {
    const user = await request.user;
    return await this.authenticationFacadeService.signin(request, user);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('signout')
  public async signout(@Req() req: RequestWithUser, @Res() response: Response): Promise<void> {
    const user = await req.user;
    await this.authenticationFacadeService.signout(req, user, response);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  public async signinWithGoogle(): Promise<void> {
    // empty on purpose: passport google strategy will initiate the google
    // authentication acknowledgement dialog and then redirect to
    // 'google/redirect' endpoint
  }

  /**
   * Injecting I18nLang here will just return the fallback language of
   * i18nModule. Due to lack of ExecutionContext in the passport strategy, the
   * frontend is required to make a separate call to propagate the preferred
   * locale of the third party signin user.
   *
   * @param request -
   * @param response -
   */
  @ApiExcludeEndpoint()
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  public async signinWithGoogleCallback(@Req() request: RequestWithUser): Promise<any> {
    const user = await request.user;
    let response: SigninResponseDto | undefined;
    if (!user) {
    } else {
      try {
        response = await this.authenticationFacadeService.signin(request, user);
      } catch (error) {
        // catched to ensure that the frontend is notified about end of signin
      }
    }
    // We don't have the correct locale at this point, but it doesn't matter.
    // We only need to provide one of the valid frontend locales to generate a
    // valid URL. This call will be intercepted in the frontend to close the
    // Google consent window and return the focus to the previously opened
    // application window which is displayed in the users preferred locale.
    request.res.redirect(
      this.buildFrontendUri(
        this._authConfig.frontendFeedbackPath3rdPartySignin(this.getFrontendLocale(user), response?.accessToken?.token)
      )
    );
  }

  @ApiExcludeEndpoint()
  @Public()
  @UseGuards(SecureAccountActionGuard)
  @Get(AuthRouteConstants.Path_ResetPassword)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async resetPassword(
    @Req() request: RequestWithUser,
    @Query(AuthRouteConstants.QueryParam_Token) token: string,
    @Res() response: Response
  ): Promise<any> {
    const user = await request.user;

    if (!user) {
      response
        .status(302)
        .redirect(
          this.buildFrontendUri(
            this._authConfig.frontendFeedbackPathInvalidTokenResetPassword(this.getFrontendLocale(user))
          )
        );
    } else {
      response
        .status(302)
        .redirect(
          this.buildFrontendUri(
            this._authConfig.frontendFeedbackPathChangePassword(this.getFrontendLocale(user), token, user.username)
          )
        );
    }
  }

  @HttpCode(204)
  @Public()
  @UseGuards(SecureAccountActionGuard)
  @Patch('password')
  public async patchPassword(
    @Req() request: RequestWithUser,
    @Body() patchPasswordData: PatchPasswordDto
  ): Promise<void> {
    const user = await request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const updatedUser = await this.authenticationFacadeService.changePassword(
      user.entityInfo.id,
      patchPasswordData.password,
      patchPasswordData.token
    );
    if (!updatedUser) {
      throw new BadRequestException('Update failed');
    }
  }

  private buildFrontendUri(path: string): string {
    return `${this._authConfig.authFrontendUrl()}${path}`;
  }

  private getFrontendLocale(user: User): string {
    return user?.preferredLocale ?? 'en';
  }
}
