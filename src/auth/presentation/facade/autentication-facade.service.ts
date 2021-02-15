import { AccountActionEmailService } from '@eg-auth/service/account-action-email.service';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { JwtTokenDto } from './dto/jwt-token.dto';
import { SendAccountActionLinkDto } from './dto/send-account-action-link.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { JwtTokenDtoMapper } from './mapper/jwt-token-dto.mapper';
import { SigninResonseDtoMapper } from './mapper/signin-response-dto.mapper';

@Injectable()
export class AuthenticationFacadeService {
  public constructor(
    private authenticationService: AuthenticationService,
    private accountActionEmailService: AccountActionEmailService,
    private jwtTokenDtoMapper: JwtTokenDtoMapper,
    private signinResonseDtoMapper: SigninResonseDtoMapper
  ) {}

  public async sendAccountActionEmail(dto: SendAccountActionLinkDto): Promise<void> {
    return this.accountActionEmailService.sendAccountActionEmail(dto.purpose, dto.email);
  }

  public async signup(dto: SignupUserDto): Promise<boolean> {
    const user = await this.authenticationService.signup(dto.username, dto.email, dto.password);
    return Promise.resolve(user ? true : false);
  }

  public deleteAccount(user: User): Promise<boolean> {
    return this.authenticationService.deleteAccount(user?.email);
  }

  public verifyEmail(user: User): Promise<User> {
    return this.authenticationService.verifyEmail(user);
  }

  public async generateAccessToken(user: User): Promise<JwtTokenDto> {
    const token = await this.authenticationService.generateAccessToken(user);
    return this.jwtTokenDtoMapper.toDto(token);
  }

  public async generateNextRefreshToken(user: User, previousRefreshToken: string): Promise<string> {
    return this.authenticationService.generateNextRefreshToken(user, previousRefreshToken);
  }

  public getJwtExpirationDate(token: string): Date | null {
    return this.authenticationService.getJwtExpirationDate(token);
  }

  public async signin(request: Request, user: User): Promise<SigninResponseDto> {
    const token = await this.authenticationService.signin(request, user);
    return this.signinResonseDtoMapper.toDto({ user: user, jsonWebToken: token });
  }

  public async signout(request: Request, user: User): Promise<boolean> {
    return this.authenticationService.signout(request, user);
  }
}
