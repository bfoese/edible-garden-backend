import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private authenticationService: AuthenticationService) {
    super();
  }
  public async validate(userNameOrEmail: string, password: string): Promise<User> {
    const user = await this.authenticationService.validateLoginCredentials(userNameOrEmail, password);
    return user;
  }
}
