import { JwtActivateAccountGuard } from '@eg-auth/guards/jwt-activate-account.guard';
import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@eg-auth/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '@eg-auth/guards/local-authentication.guard';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { RequestWithUser } from '@eg-auth/strategies/request-with-user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthenticationFacadeService } from '../facade/autentication-facade.service';
import { JwtTokenDto } from '../facade/dto/jwt-token.dto';
import { LoginUserDto } from '../facade/dto/login-user.dto';
import { RegisterUserDto } from '../facade/dto/register-user.dto';
import { UserDto } from '../facade/dto/user.dto';
import { UserMapper } from '../facade/mapper/user.mapper';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  public constructor(
    private readonly authenticationFacadeService: AuthenticationFacadeService,
    private readonly userMapper: UserMapper
  ) {}

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
  @UseGuards(JwtActivateAccountGuard)
  @Get('activate')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async activateAccount(
    @Req() request: RequestWithUser,
    @Query('token') _token: string,
    @Res() response: Response
  ): Promise<any> {
    const user = await request.user;
    // TODO redirectUrl
    return this.authenticationFacadeService
      .activateAccount(user)
      .then(() => response.status(302).redirect('http://localhost:4200'));
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refresh(@Req() request: RequestWithUser): Promise<JwtTokenDto> {
    const user = await request.user;
    const previousRefreshToken = AuthenticationService.getJwtRefreshCookie(request);

    const accessToken = this.authenticationFacadeService.generateAccessToken(user);
    const refreshToken = await this.authenticationFacadeService.generateNextRefreshToken(user, previousRefreshToken);
    request.res.cookie(AuthenticationService.JwtRefreshCookieName, refreshToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      expires: this.authenticationFacadeService.getJwtExpirationDate(refreshToken),
    });

    return accessToken;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async login(@Req() request: RequestWithUser, @Body() _loginData: LoginUserDto): Promise<JwtTokenDto> {
    const user = await request.user;
    if (user) {
      const accessToken = this.authenticationFacadeService.generateAccessToken(user);
      const refreshToken = await this.authenticationFacadeService.generateNextRefreshToken(user, null);
      request.res.cookie(AuthenticationService.JwtRefreshCookieName, refreshToken, {
        httpOnly: true,
        signed: true,
        secure: true,
        expires: this.authenticationFacadeService.getJwtExpirationDate(refreshToken),
      });
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
}
