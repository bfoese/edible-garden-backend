import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthenticationGuard } from 'src/auth/guards/local-authentication.guard';
import { RequestWithUser } from 'src/auth/strategies/request-with-user';

import { AuthenticationFacadeService } from '../facade/autentication-facade.service';
import { JwtTokenDto } from '../facade/dto/jwt-token.dto';
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

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  public async login(@Request() req: RequestWithUser): Promise<JwtTokenDto> {
    const user = await req.user;
    return this.authenticationFacadeService.login(user);
  }

  // TODO move to different controller
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Request() req: RequestWithUser): Promise<UserDto> {
    const user = await req.user;
    return this.userMapper.toDto(user);
  }
}
