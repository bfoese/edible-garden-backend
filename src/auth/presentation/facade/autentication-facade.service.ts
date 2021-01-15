import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from 'src/auth/authentication.service';

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

  public async login(user: User): Promise<JwtTokenDto> {
    return this.authenticationService.login(user);
  }
}
