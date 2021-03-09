import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class UserSerializer extends PassportSerializer {
  public constructor(private readonly userService: UserService) {
    super();
  }

  public serializeUser(user: User, done: (err: any, id?: any) => void): void {
    done(null, user?.entityInfo?.id);
  }

  public deserializeUser(userId: string, done: (err: any, id?: any) => void): void {
    this.userService
      .findById(userId)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}
