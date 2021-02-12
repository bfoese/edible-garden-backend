import { AccountActionEmailService } from '@eg-auth/service/account-action-email.service';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { JwtTokenDto } from './dto/jwt-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendAccountActionLinkDto } from './dto/send-account-action-link.dto';

@Injectable()
export class AuthenticationFacadeService {
  public constructor(
    private authenticationService: AuthenticationService,
    private accountActionEmailService: AccountActionEmailService
  ) {}

  public async sendAccountActionEmail(dto: SendAccountActionLinkDto): Promise<void> {
    return this.accountActionEmailService.sendAccountActionEmail(dto.purpose, dto.email);
  }

  public async register(dto: RegisterUserDto): Promise<boolean> {
    const user = await this.authenticationService.register(dto.username, dto.email, dto.password);
    return Promise.resolve(user ? true : false);
  }

  public deleteAccount(user: User): Promise<boolean> {
    return this.authenticationService.deleteAccount(user?.email);
  }

  public activateAccount(user: User): Promise<User> {
    return this.authenticationService.activateAccount(user);
  }

  public async mapAccessToken(jwtToken: string): Promise<JwtTokenDto> {
    const tokenDto = {
      // had to provide secret and expiration time here again, even though its
      // configured already for the imported JwtModule - don't know why,
      // whithout it, no secret was found
      access_token: jwtToken,
    } as JwtTokenDto;
    return tokenDto;
  }

  public async generateAccessToken(user: User): Promise<JwtTokenDto> {
    const tokenDto = {
      // had to provide secret and expiration time here again, even though its
      // configured already for the imported JwtModule - don't know why,
      // whithout it, no secret was found
      access_token: await this.authenticationService.generateAccessToken(user),
    } as JwtTokenDto;
    return tokenDto;
  }

  public async generateNextRefreshToken(user: User, previousRefreshToken: string): Promise<string> {
    return this.authenticationService.generateNextRefreshToken(user, previousRefreshToken);
  }

  public getJwtExpirationDate(token: string): Date | null {
    return this.authenticationService.getJwtExpirationDate(token);
  }

  public async login(request: Request, user: User): Promise<JwtTokenDto> {
    const token = await this.authenticationService.login(request, user);
    return token ? this.mapAccessToken(token) : null;
  }

  public async logout(request: Request, user: User): Promise<boolean> {
    return this.authenticationService.logout(request, user);
  }
}
