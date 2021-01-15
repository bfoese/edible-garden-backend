import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';

import { User } from './user';

export interface UserRepository {
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User>;
  create(user: User): Promise<User | UniqueConstraintViolation>;
}
