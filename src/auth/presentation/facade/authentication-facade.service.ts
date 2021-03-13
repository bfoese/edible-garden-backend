import { AccountActionEmailService } from '@eg-auth/service/account-action-email.service';
import { AuthenticationService } from '@eg-auth/service/authentication.service';
import { ExternalAuthProvider } from '@eg-domain/user/external-auth-provider.enum';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { SendAccountActionLinkDto } from './dto/send-account-action-link.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninResonseDtoMapper } from './mapper/signin-response-dto.mapper';

@Injectable()
export class AuthenticationFacadeService {
  public constructor(
    private authenticationService: AuthenticationService,
    private accountActionEmailService: AccountActionEmailService,
    private signinResonseDtoMapper: SigninResonseDtoMapper
  ) {}

  public async sendAccountActionEmail(dto: SendAccountActionLinkDto): Promise<void> {
    return this.accountActionEmailService.sendAccountActionEmail(dto.purpose, dto.email);
  }

  public async signup(dto: SignupUserDto): Promise<boolean> {
    const user = await this.authenticationService.signup(dto.username, dto.email, dto.password, dto.preferredLocale);
    return Promise.resolve(user ? true : false);
  }

  public signupOrUpdateExtAuthProviderUser(
    extAuthProvider: ExternalAuthProvider,
    externalUserId: string,
    email: string,
    username: string,
    preferredLocale: string
  ): Promise<User | undefined> {
    return this.authenticationService.signupOrUpdateExtAuthProviderUser(
      extAuthProvider,
      externalUserId,
      email,
      username,
      preferredLocale
    );
  }

  public deleteAccount(user: User): Promise<boolean> {
    return this.authenticationService.deleteAccount(user?.entityInfo?.id);
  }

  public verifyEmail(user: User): Promise<User> {
    return this.authenticationService.verifyEmail(user);
  }

  public getJwtExpirationDate(token: string): Date | null {
    return this.authenticationService.getJwtExpirationDate(token);
  }

  public async refresh(request: Request, user: User): Promise<SigninResponseDto> {
    const token = await this.authenticationService.refresh(request, user);
    return this.signinResonseDtoMapper.toDto({ user: user, jsonWebToken: token });
  }

  public async signin(request: Request, user: User): Promise<SigninResponseDto> {
    const token = await this.authenticationService.signin(request, user);
    return this.signinResonseDtoMapper.toDto({ user: user, jsonWebToken: token });
  }

  public async signout(request: Request, user: User): Promise<boolean> {
    return this.authenticationService.signout(request, user);
  }

  public async changePassword(userId: string, plainTextPassword: string, token: string): Promise<User> {
    return this.authenticationService.changePassword(userId, plainTextPassword, token);
  }

}
