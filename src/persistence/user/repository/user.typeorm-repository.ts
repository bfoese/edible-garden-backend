import { User } from '@eg-domain/user/user';
import { EntityRepository, Repository } from 'typeorm';

import { UserSchema } from '../schema/user.schema';

@EntityRepository(UserSchema)
export class UserTypeOrmRepository extends Repository<User> {}
