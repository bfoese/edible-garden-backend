import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';

import { CommonFindOptions } from './common-find-options';
import { ExternalAuthProvider } from './external-auth-provider.enum';
import { User } from './user';
import { UserFindOptions } from './user-find-options';

export interface UserRepository {


  findById(email: string, opts?: UserFindOptions): Promise<User>;

  findByExtAuthProviderId(provider: ExternalAuthProvider, externalUserId: string, opts?: UserFindOptions): Promise<User>;

  /**
   * Important: Since email is only unique per auth provider, this
   * method will ONLY query accounts without external auth provider.
   * @param usernameOrEmail -
   * @param opts -
   */
  findByEmail(email: string, opts?: CommonFindOptions): Promise<User>;

  /**
   * Important: Since username and email are only unique per auth provider, this
   * method will ONLY query accounts without external auth provider.
   * @param usernameOrEmail -
   * @param opts -
   */
  findByUsernameOrEmail(usernameOrEmail: string, opts?: UserFindOptions): Promise<User>;
  create(user: Partial<User>): Promise<User | UniqueConstraintViolation<User>>;
  save(user: Partial<User>): Promise<User | UniqueConstraintViolation<User>>;

  /**
   * Important: based on the provided user object ONE or MANY users might be
   * deleted.
   * @param user - This acts as a pattern of where conditions to find matching
   * users. If you want do delete a single specific user, you need to provide fields
   * which are unique within the user schema.
   * @returns Number of deleted rows
   */
  delete(user: Partial<User>): Promise<number>;

  deleteAccountActionToken(userId: string, token: string): Promise<void>;
}
