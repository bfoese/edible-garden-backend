import appConfig from '@eg-app/config/app.config';
import { AuthRouteConstants } from '@eg-auth/constants/auth-route-constants';
import { Public } from '@eg-auth/decorators/public-endpoint.decorator';
import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@eg-auth/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '@eg-auth/guards/local-authentication.guard';
import { SecureAccountActionGuard } from '@eg-auth/guards/secure-account-action.guard';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { RequestWithUser } from '@eg-auth/strategies/request-with-user';
import { User } from '@eg-domain/user/user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { UserDto } from '../../../core/facade/dto/user.dto';
import { UserMapper } from '../../../core/facade/mapper/user.mapper';
import { AuthenticationFacadeService } from '../facade/autentication-facade.service';
import { JwtTokenDto } from '../facade/dto/jwt-token.dto';
import { LoginUserDto } from '../facade/dto/login-user.dto';
import { RegisterUserDto } from '../facade/dto/register-user.dto';
import { SendAccountActionLinkDto } from '../facade/dto/send-account-action-link.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  public constructor(
    private readonly authenticationFacadeService: AuthenticationFacadeService,
    private readonly userMapper: UserMapper,
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>
  ) {}

  /**
   * Request account activation email, reset password email, delete account
   * email to be send to the users email account.
   *
   * @param dto - containing user data and type of email to be send
   */
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
  @Post('register')
  public register(@Body() dto: RegisterUserDto): Promise<boolean> {
    return this.authenticationFacadeService.register(dto);
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
  @Public()
  @UseGuards(SecureAccountActionGuard)
  @Get(AuthRouteConstants.Path_ActivateAccount)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async activateAccount(
    @Req() request: RequestWithUser,
    @Query(AuthRouteConstants.QueryParam_Token) _token: string,
    @Res() response: Response
  ): Promise<any> {
    const user = await request.user;
    // in case of token validation errors, the user will be user=false
    const activatedUser = user ? await this.authenticationFacadeService.activateAccount(user) : null;

    if (activatedUser) {
      response
        .status(302)
        .redirect(`${this._appConfig.authFrontendUrl()}/de_AT/auth/signin?accountActivationSuccess=true`);
    } else {
      response.status(302).redirect(`${this._appConfig.authFrontendUrl()}/de_AT/auth/signup?invalidActivationToken=true`);
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
      .redirect(`${this._appConfig.authFrontendUrl()}/de_AT/auth/feedback?accountDeleted=${accountDeleted}`);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refresh(@Req() request: RequestWithUser): Promise<JwtTokenDto> {
    const user = await request.user;
    console.log('refresh request', user, request.signedCookies, request.cookies);
    const previousRefreshToken = AuthenticationService.getJwtRefreshCookie(request);

    const accessToken = this.authenticationFacadeService.generateAccessToken(user);
    await this.addRefreshTokenCookie(request, previousRefreshToken, user);
    return accessToken;
  }

  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async login(@Req() request: RequestWithUser, @Body() _loginData: LoginUserDto): Promise<JwtTokenDto> {
    const user = await request.user;
    if (user) {
      const accessToken = this.authenticationFacadeService.generateAccessToken(user);
      await this.addRefreshTokenCookie(request, null, user);
      return accessToken;
    }
    return null;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  public async logout(@Req() req: RequestWithUser): Promise<boolean> {
    const user = await req.user;
    return this.authenticationFacadeService.logout(user);
  }

  // TODO move to different controller
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Req() req: RequestWithUser): Promise<UserDto> {
    const user = await req.user;
    return this.userMapper.toDto(user);
  }

  private async addRefreshTokenCookie(
    request: RequestWithUser,
    previousRefreshToken: string,
    user: User
  ): Promise<void> {
    const refreshToken = await this.authenticationFacadeService.generateNextRefreshToken(user, previousRefreshToken);
    request.res.cookie(AuthenticationService.JwtRefreshCookieName, refreshToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      domain: this._appConfig.authCookieDomain(),
      expires: this.authenticationFacadeService.getJwtExpirationDate(refreshToken),
    });
  }
}
