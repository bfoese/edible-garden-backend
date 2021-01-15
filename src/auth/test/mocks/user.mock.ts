import { EntityInfo } from '@eg-domain/shared/entity-info';
import { User } from '@eg-domain/user/user';

const mockedUser: User = new User();

mockedUser.email = 'foo@bar.baz';
mockedUser.password = 'test123';
mockedUser.username = 'me.foo';
mockedUser.entityInfo = new EntityInfo();
mockedUser.entityInfo.id = '1234-5678-910';
mockedUser.entityInfo.isActive = true;

export default mockedUser;
