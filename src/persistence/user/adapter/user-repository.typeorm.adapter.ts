import { User } from '@eg-domain/user/user';
import { UserRepository } from '@eg-domain/user/user-repository.interface';
import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';
import { UniqueConstraintViolationFactory } from '@eg-persistence/shared/unique-constraint-violation.extractor';
import { Injectable } from '@nestjs/common';

import { UserTypeOrmRepository } from '../repository/user.typeorm-repository';
import { UserSchema } from '../schema/user.schema';

@Injectable()
export class UserRepositoryTypeOrmAdapter implements UserRepository {
  public constructor(private readonly userRepository: UserTypeOrmRepository) {}

  public findByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email')
      .setParameters({
        email: email,
      })
      .getOne();
  }

  public findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username=:username')
      .orWhere('user.email=:email')
      .setParameters({
        username: usernameOrEmail,
        email: usernameOrEmail,
      })
      .getOne();
  }

  public create(user: User): Promise<User | UniqueConstraintViolation> {
    return this.userRepository.save(user).catch((error) => {
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

  public save(user: User): Promise<User | UniqueConstraintViolation> {
    return this.userRepository.save(user).catch((error) => {
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
}
