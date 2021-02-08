import { UniqueKeyConstraintViolationException } from '@eg-app/exception/unique-key-violation.exception';
import { ArrayUtils } from '@eg-common/util/array.utils';
import { CommonFindOptions } from '@eg-domain/user/common-find-options';
import { User } from '@eg-domain/user/user';
import { UserFindOptions } from '@eg-domain/user/user-find-options';
import { UserRepository } from '@eg-domain/user/user-repository.interface';
import { UserValidation } from '@eg-domain/user/user-validation';
import { UniqueConstraintViolation } from '@eg-persistence/shared/unique-constraint-violation';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const UserRepo = () => Inject('UserRepositoryTypeOrm');

@Injectable()
export class UserService {
  public constructor(@UserRepo() private readonly userRepository: UserRepository) {}

  public async findByUsernameOrEmail(usernameOrEmail: string, opts?: UserFindOptions): Promise<User | undefined> {
    const user = await this.userRepository.findByUsernameOrEmail(usernameOrEmail, opts);
    return user;
  }

  public async findByEmail(email: string, opts?: CommonFindOptions): Promise<User | undefined> {
    const user = await this.userRepository.findByEmail(email, opts);
    return user;
  }

  public async getPasswordFromUser(usernameOrEmail: string): Promise<string | undefined> {
    const user = await this.userRepository.findByUsernameOrEmail(usernameOrEmail, {
      withHiddenFields: { password: true },
    } as UserFindOptions);
    return user ? user.password : undefined;
  }

  public async create(user: User): Promise<User> | never {
    const errors: ValidationError[] = await validate(user, <ValidatorOptions>{
      groups: [UserValidation.groups.userRegistration],
    });

    if (!ArrayUtils.isEmpty(errors)) {
      throw new BadRequestException(errors);
    }

    return this.userRepository.create(user).then((result: User | UniqueConstraintViolation<User>) => {
      if (result instanceof UniqueConstraintViolation) {
        throw new UniqueKeyConstraintViolationException(result.constraintColumns);
      }
      return this.unexposePassword(result);
    });
  }

  public async save(user: User): Promise<User> | never {
    return this.userRepository.save(user).then((result: User | UniqueConstraintViolation<User>) => {
      if (result instanceof UniqueConstraintViolation) {
        throw new UniqueKeyConstraintViolationException(result.constraintColumns);
      }
      return this.unexposePassword(result);
    });
  }

  public async activateAccount(usernameOrEmail: string): Promise<User> | never {
    const user = await this.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return null;
    }
    user.entityInfo.isActive = true;
    return this.userRepository.save(user).then((result: User) => {
      return this.unexposePassword(result);
    });
  }

  public async deleteAccountPermanently(email: string): Promise<boolean> | never {
    if (!email) {
      return false;
    }
    return this.userRepository.delete({ email: email } as User).then((affectedRows: number) => {
      return affectedRows > 0;
    });
  }

  /**
   * In almost all cases, we don't want the password to be exposed. This method
   * will clear the password field.
   * @param user -
   * @returns user object without password
   */
  private unexposePassword(user: User): User {
    // if (user) {
    //   user.password = undefined;
    // }
    return user;
  }
}
