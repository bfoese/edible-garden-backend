import { JwtActivateAccountGuard } from '@eg-auth/guards/jwt-activate-account.guard';
import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@eg-auth/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '@eg-auth/guards/local-authentication.guard';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { RequestWithUser } from '@eg-auth/strategies/request-with-user';
import { User } from '@eg-domain/user/user';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticationFacadeService } from '../facade/autentication-facade.service';
import { JwtTokenDto } from '../facade/dto/jwt-token.dto';
import { LoginUserDto } from '../facade/dto/login-user.dto';
import { RegisterUserDto } from '../facade/dto/register-user.dto';
import { UserDto } from '../facade/dto/user.dto';
import { UserMapper } from '../facade/mapper/user.mapper';

@ApiTags('Authentication')
@Controller('authentication')
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
   * TODO on success redirect to a page with success message
   * @param request -
   * @param dto -
   */
  @UseGuards(JwtActivateAccountGuard)
  @Post('activate-account')
  public async activateAccount(@Req() request: RequestWithUser, @Body() dto: JwtTokenDto): Promise<User | null> {
    const user = await request.user;
    console.log('activateAccount', user, dto);
    return this.authenticationFacadeService.activateAccount(user);
  }


  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
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
