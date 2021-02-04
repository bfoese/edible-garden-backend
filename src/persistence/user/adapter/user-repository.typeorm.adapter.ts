import { DeleteResult } from '@bfoese/typeorm';
import { CryptoService } from '@eg-app/crypto/crypto.service';
import { CommonFindOptions } from '@eg-domain/user/common-find-options';
import { User } from '@eg-domain/user/user';
import { UserFindOptions } from '@eg-domain/user/user-find-options';
import { UserRepository } from '@eg-domain/user/user-repository.interface';
import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';
import { UniqueConstraintViolationFactory } from '@eg-persistence/shared/unique-constraint-violation.extractor';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { UserTypeOrmRepository } from '../repository/user.typeorm-repository';
import { UserSchema } from '../schema/user.schema';

@Injectable()
export class UserRepositoryTypeOrmAdapter implements UserRepository {
  private readonly plainToClass: (user: User) => User = (user) => plainToClass(User, user);

  public constructor(private readonly userRepository: UserTypeOrmRepository, private cryptoService: CryptoService) {}

  public async findByEmail(email: string, opts?: CommonFindOptions): Promise<User> {
    const user: User = this.encryptFieldsBeforeQueryQuery({ ...{ email: email } } as User);

    let qb = this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.email')
      .where('user.email=:email')
      .setParameters({
        email: user.email,
      });

    if (opts?.withDeleted) {
      qb = qb.withDeleted();
    }
    const result = await qb.getOne().then(this.plainToClass);
    return result;
  }

  public async findByUsernameOrEmail(usernameOrEmail: string, opts?: UserFindOptions): Promise<User> {
    const user: User = this.encryptFieldsBeforeQueryQuery({
      ...{ email: usernameOrEmail, username: usernameOrEmail },
    } as User);
    const qb = this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.email')
      .where('user.username=:username')
      .orWhere('user.email=:email')
      .setParameters({
        username: user.username,
        email: user.email,
      });

    if (opts?.withHiddenFields?.password) {
      qb.addSelect('user.password');
    }

    if (opts?.withHiddenFields?.accountActionToken) {
      qb.addSelect('user.accountActionToken');
    }

    if (opts?.withHiddenFields?.address) {
      qb.addSelect('user.address');
    }

    if (opts?.withHiddenFields?.phoneNumber) {
      qb.addSelect('user.phoneNumber');
    }

    const result = qb.getOne().then(this.plainToClass);
    return result;
  }

  public create(user: User): Promise<User | UniqueConstraintViolation> {
    return this.userRepository
      .save(user)
      .then(this.plainToClass)
      .catch((error) => {
        const violatedUniqueConstraint = UniqueConstraintViolationFactory.getUniqueConstraintViolationOrNull(
          error,
          UserSchema,
          user
        );

        if (violatedUniqueConstraint) {
          return violatedUniqueConstraint;
        } else throw error;
      });
  }

  public async save(user: User): Promise<User | UniqueConstraintViolation> {
    const result = await this.userRepository
      .save(user)
      .then(this.plainToClass)
      .catch((error) => {
        const violatedUniqueConstraint = UniqueConstraintViolationFactory.getUniqueConstraintViolationOrNull(
          error,
          UserSchema,
          user
        );

        if (violatedUniqueConstraint) {
          return violatedUniqueConstraint;
        } else throw error;
      });
    return result;
  }

  /**
   * Important: based on the provided user object ONE or MANY users might be
   * deleted.
   * @param user - This acts as a pattern of where conditions to find matching
   * users. If you want do delete a single specific user, you need to provide fields
   * which are unique within the user schema.
   * @returns Number of deleted rows
   */
  public delete(user: User): Promise<number> {
    user = this.encryptFieldsBeforeQueryQuery(user);
    return this.userRepository.delete(user).then((result: DeleteResult) => result.affected ?? 0);
  }

  private encryptFieldsBeforeQueryQuery(user: User): User {
    if (user?.email) {
      user.email = this.cryptoService.deterministicEncryption(user.email);
    }
    return user;
  }
}
