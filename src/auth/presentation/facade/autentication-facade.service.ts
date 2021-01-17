import { AuthenticationService } from '@eg-auth/authentication.service';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';

import { JwtTokenDto } from './dto/jwt-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserMapper } from './mapper/register-user.mapper';

@Injectable()
export class AuthenticationFacadeService {
  public constructor(
    private authenticationService: AuthenticationService,
    private registerUserMapper: RegisterUserMapper
  ) {}

  public async register(dto: RegisterUserDto): Promise<boolean> {
    const registrationData = this.registerUserMapper.ontoEntity(dto, new User());
    const user = await this.authenticationService.register(registrationData);
    return Promise.resolve(user ? true : false);
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

  public async logout(user: User): Promise<boolean> {
    return this.authenticationService.logout(user);
  }
}
