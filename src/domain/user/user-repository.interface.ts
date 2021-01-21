import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';

import { User } from './user';

export interface UserRepository {
  findByEmail(email: string): Promise<User>;
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User>;
  create(user: User): Promise<User | UniqueConstraintViolation>;
  save(user: User): Promise<User | UniqueConstraintViolation>;
}
