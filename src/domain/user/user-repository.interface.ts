import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';

import { CommonFindOptions } from './common-find-options';
import { User } from './user';
import { UserFindOptions } from './user-find-options';

export interface UserRepository {
  findByEmail(email: string, opts?: CommonFindOptions): Promise<User>;
  findByUsernameOrEmail(usernameOrEmail: string, opts?: UserFindOptions): Promise<User>;
  create(user: User): Promise<User | UniqueConstraintViolation>;
  save(user: User): Promise<User | UniqueConstraintViolation>;

  /**
   * Important: based on the provided user object ONE or MANY users might be
   * deleted.
   * @param user - This acts as a pattern of where conditions to find matching
   * users. If you want do delete a single specific user, you need to provide fields
   * which are unique within the user schema.
   * @returns Number of deleted rows
   */
  delete(user: User): Promise<number>;
}
