import { User } from '@eg-domain/user/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private authenticationService: AuthenticationService) {
    super();
  }
  public async validate(userNameOrEmail: string, password: string): Promise<User> {
    const user = await this.authenticationService.validateUser(userNameOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
