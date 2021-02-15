import { EntityInfo } from '@eg-domain/shared/entity-info';
import { User } from '@eg-domain/user/user';

export class UserMockFactory {
  private static createDefault(): User {
    const mockedUser: User = new User();

    mockedUser.email = 'foo@bar.baz';
    mockedUser.password = 'test123';
    mockedUser.username = 'me.foo';
    mockedUser.entityInfo = new EntityInfo();
    mockedUser.entityInfo.id = '1234-5678-910';
    mockedUser.entityInfo.isActive = true;
    mockedUser.isEmailVerified = true;
    return mockedUser;
  }

  public static createSigninAllowed
  (): User {
    return this.createDefault();
  }

  public static createInactive(): User {
    const user = this.createDefault();
    user.entityInfo.isActive = false;
    return user;
  }

  public static createEmailNotVerified(): User {
    const user = this.createDefault();
    user.isEmailVerified = false;
    return user;
  }

  public static createDeleted(): User {
    const user = this.createDefault();
    user.entityInfo.deleted = new Date();
    return user;
  }
}
