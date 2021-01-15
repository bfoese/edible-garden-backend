import { UniqueKeyViolationException } from '@eg-auth/exceptions/unique-key-violation.exception';
import { ArrayUtil } from '@eg-common/util/array.util';
import { User } from '@eg-domain/user/user';
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

  public async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
    const user = await this.userRepository.findByUsernameOrEmail(usernameOrEmail);
    return this.unexposePassword(user);
  }

  public async getPasswordFromUser(usernameOrEmail: string): Promise<string | undefined> {
    const user = await this.userRepository.findByUsernameOrEmail(usernameOrEmail);
    return user ? user.password : undefined;
  }

  public async create(user: User): Promise<User> | never {
    const errors: ValidationError[] = await validate(user, <ValidatorOptions>{
      groups: [UserValidation.groups.userRegistration],
    });

    if (!ArrayUtil.isEmpty(errors)) {
      throw new BadRequestException(errors);
    }

    return this.userRepository.create(user).then((result: User | UniqueConstraintViolation) => {
      if (result instanceof UniqueConstraintViolation) {
        throw new UniqueKeyViolationException();
      }
      return this.unexposePassword(result);
    });
  }

  /**
   * In almost all cases, we don't want the password to be exposed. This method
   * will clear the password field.
   * @param user -
   * @returns user object without password
   */
  private unexposePassword(user: User): User {
    if (user) {
      user.password = undefined;
    }
    return user;
  }
}
