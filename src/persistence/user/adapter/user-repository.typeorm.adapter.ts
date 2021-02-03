import { DeleteResult } from '@bfoese/typeorm';
import { CryptoService } from '@eg-app/crypto/crypto.service';
import { User } from '@eg-domain/user/user';
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

  public async findByEmail(email: string, opts?: { withDeleted: boolean; }): Promise<User> {
    let qb = this.userRepository.createQueryBuilder('user').where('user.email=:email').setParameters({
      email: this.cryptoService.deterministicEncryption(email),
    });

    if (opts?.withDeleted) {
      qb = qb.withDeleted();
    }
    const result = await qb.getOne().then(this.plainToClass);
    return result;
  }

  public async findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username=:username')
      .orWhere('user.email=:email')
      .setParameters({
        username: usernameOrEmail,
        email: this.cryptoService.deterministicEncryption(usernameOrEmail),
      })
      .getOne()
      .then(this.plainToClass);
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

    if (user?.email) {
      user.email = this.cryptoService.deterministicEncryption(user.email);
    }
    return this.userRepository.delete(user).then((result: DeleteResult) => result.affected ?? 0);
  }
}
