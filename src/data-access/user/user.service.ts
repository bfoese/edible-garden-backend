import { UniqueKeyConstraintViolationException } from '@eg-app/exception/unique-key-violation.exception';
import { ArrayUtils } from '@eg-common/util/array.utils';
import { CommonFindOptions } from '@eg-domain/user/common-find-options';
import { ExternalAuthProvider } from '@eg-domain/user/external-auth-provider.enum';
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


  public async findByExtAuthProviderId(extAuthProvider: ExternalAuthProvider, externalUserId: string, opts?: UserFindOptions): Promise<User | undefined> {
    return this.userRepository.findByExtAuthProviderId(extAuthProvider, externalUserId, opts);
  }

  public async findById(userId: string, opts?: UserFindOptions): Promise<User | undefined> {
    return this.userRepository.findById(userId, opts);
  }


  public async findByUsernameOrEmail(usernameOrEmail: string, opts?: UserFindOptions): Promise<User | undefined> {
    return await this.userRepository.findByUsernameOrEmail(usernameOrEmail, opts);
  }

  public async findByEmail(email: string, opts?: CommonFindOptions & UserFindOptions): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email, opts);
  }

  public async getPasswordFromUser(usernameOrEmail: string): Promise<string | undefined> {
    const user = await this.userRepository.findByUsernameOrEmail(usernameOrEmail, {
      withHiddenFields: { password: true },
    } as UserFindOptions);
    return user ? user.password : undefined;
  }

  public async create(user: User): Promise<User> | never {
    const errors: ValidationError[] = await validate(user, <ValidatorOptions>{
      groups: [user.extAuthProvider ? UserValidation.groups.userExtAuthProviderRegistration : UserValidation.groups.userRegistration],
    });

    if (!ArrayUtils.isEmpty(errors)) {
      throw new BadRequestException(errors);
    }

    return this.userRepository.create(user).then((result: User | UniqueConstraintViolation<User>) => {
      if (result instanceof UniqueConstraintViolation) {
        throw new UniqueKeyConstraintViolationException(result.constraintColumns);
      }
      return result;
    });
  }

  /**
   * Can be used to partially update the user data except for some fields, which
   * will be omitted. The omitted fields are considered sensitive and must be
   * updated via dedicated methods.
   *
   * @param user - Omitted values can only be updated via other dedicated
   * methods.
   * @returns
   */
  public async save(user: Omit<User, 'username' | 'email' | 'password' | 'isEmailVerified'>): Promise<User> | never {
    return this.userRepository.save(user).then((result: User | UniqueConstraintViolation<User>) => {
      if (result instanceof UniqueConstraintViolation) {
        throw new UniqueKeyConstraintViolationException(result.constraintColumns);
      }
      return result;
    });
  }

  /**
   * Switches the isEmailVerified flag of the user to 'true' to indicate, that
   * the email address was successfully verified.
   *
   * @param userId -
   */
  public async verifyEmail(userId: string): Promise<User> | never {
    if (!userId) {
      return null;
    }
    const newData = { entityInfo: { id: userId }, isEmailVerified: true } as User
    return this.userRepository.save(newData).then((result: User) => {
      return result;
    });
  }

  /**
   * Updated the users password to the new value.
   * @param userId
   * @param hashedPassword - Must be the hashed passwort, the database schema won't perform the hashing!
   * @returns
   */
  public async changePassword(userId: string, hashedPassword: string): Promise<User> | never {
    if (!userId) {
      return null;
    }

    const newData = { entityInfo: { id: userId }, password: hashedPassword } as User
    const errors: ValidationError[] = await validate(newData, <ValidatorOptions>{
      groups: [UserValidation.groups.updatePassword],
    });

    if (!ArrayUtils.isEmpty(errors)) {
      throw new BadRequestException(errors);
    }
    return this.userRepository.save(newData).then((result: User) => {
      return result;
    });
  }

  public async deleteAccountPermanently(userId: string): Promise<boolean> | never {
    if (!userId) {
      return false;
    }
    return this.userRepository.delete({ entityInfo: { id: userId } } as User).then((affectedRows: number) => {
      return affectedRows > 0;
    });
  }
}
