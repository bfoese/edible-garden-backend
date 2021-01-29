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
    return mockedUser;
  }

  public static createActive(): User {
    return this.createDefault();
  }

  public static createInactive(): User {
    const user = this.createDefault();
    user.entityInfo.isActive = false;
    return user;
  }

  public static createDeleted(): User {
    const user = this.createDefault();
    user.entityInfo.deleted = new Date();
    return user;
  }
}
