import { DeleteResult, SelectQueryBuilder } from '@bfoese/typeorm';
import { CryptoService } from '@eg-app/crypto/crypto.service';
import { CommonFindOptions } from '@eg-domain/user/common-find-options';
import { ExternalAuthProvider } from '@eg-domain/user/external-auth-provider.enum';
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

  public async findById(userId: string, opts?: CommonFindOptions & UserFindOptions): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('user').where('user.id=:userId').setParameters({
      userId: userId,
    });

    if (opts?.withDeleted) {
      qb.withDeleted();
    }
    this.enhanceSelect(qb, opts);

    const result = await qb.getOne().then(this.plainToClass);
    return result;
  }

  public async findByExtAuthProviderId(
    provider: ExternalAuthProvider,
    externalUserId: string,
    opts?: UserFindOptions
  ): Promise<User> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where(`user.id IN (Select id FROM "eg_user" u, jsonb_array_elements(u.account_Auth_Providers) providers WHERE (providers->>'extAuthProvider'=:extAuthProvider AND providers->>'extUserId'=:externalUserId))`)
      .setParameters({
        externalUserId: externalUserId,
        extAuthProvider: provider,
      });

    this.enhanceSelect(qb, opts);
    const result = await qb.getOne().then(this.plainToClass);
    return result;
  }

  public async findByEmail(email: string, opts?: CommonFindOptions & UserFindOptions): Promise<User> {
    const user: User = this.encryptFieldsBeforeQuery({ ...{ email: email } } as User);

    const qb = this.userRepository.createQueryBuilder('user').where('user.email=:email').setParameters({
      email: user.email,
    });

    if (opts?.withDeleted) {
      qb.withDeleted();
    }
    this.enhanceSelect(qb, opts);

    const result = await qb.getOne().then(this.plainToClass);
    return result;
  }

  public async findByUsernameOrEmail(usernameOrEmail: string, opts?: UserFindOptions): Promise<User> {
    const user: User = this.encryptFieldsBeforeQuery({
      ...{ email: usernameOrEmail, username: usernameOrEmail },
    } as User);
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.username=:username')
      .orWhere('user.email=:email')
      .setParameters({
        username: user.username,
        email: user.email,
      });

    this.enhanceSelect(qb, opts);

    const result = qb.getOne().then(this.plainToClass);
    return result;
  }

  private enhanceSelect(qb: SelectQueryBuilder<User>, opts: UserFindOptions): void {
    if (qb && opts) {
      if (opts?.withHiddenFields?.email) {
        qb.addSelect('user.email');
      }

      if (opts?.withHiddenFields?.password) {
        qb.addSelect('user.password');
      }

      if (opts?.withHiddenFields?.accountActionToken) {
        qb.addSelect('user.accountActionToken');
      }
    }
  }

  public create(user: User): Promise<User | UniqueConstraintViolation<User>> {
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

  public async save(user: User): Promise<User | UniqueConstraintViolation<User>> {
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
    user = this.encryptFieldsBeforeQuery(user);
    return this.userRepository.delete(user).then((result: DeleteResult) => result.affected ?? 0);
  }

  public async deleteAccountActionToken(userId: string, token: string): Promise<void> {
    await this.userRepository.update({ entityInfo: { id: userId }, accountActionToken: token } as User, { accountActionToken: null } as User);
  }

  private encryptFieldsBeforeQuery(user: User): User {
    if (user?.email) {
      user.email = this.cryptoService.deterministicEncryption(user.email);
    }
    return user;
  }
}
