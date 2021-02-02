import { Address } from '@eg-domain/shared/adress';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { UserValidation } from './user-validation';

export class User {
  public constructor() {
    this.entityInfo = new EntityInfo();
  }

  @Type(() => EntityInfo)
  public entityInfo: EntityInfo;

  @IsEmail()
  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration],
  })
  public email: string;

  @Length(UserValidation.constraints.username.minLength, UserValidation.constraints.username.maxLength)
  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration],
  })
  public username: string;

  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration],
  })
  @IsString()
  @Matches(UserValidation.constraints.password.pattern, { message: 'password too weak' })
  public password: string;

  @Type(() => Address)
  public address: Address;

  @Type(() => PhoneNumber)
  public phoneNumber: PhoneNumber;

  /**
   * Contains an encrypted JWT token which is usually send to the email account
   * of the user and will be used to confirm certain actions, i.e. register
   * user, change password, delete account. The token will be encrypted to
   * ensure that no one can use it maliciously in cases where the database was
   * leaked.
   */
  @IsString()
  public accountActionToken: string;

  @IsString()
  public preferredLocale: string;

  public isAccountActivated(): boolean {
    return this.entityInfo?.isActive;
  }

  public isAccountMarkedForDeletion(): boolean {
    return !!this.entityInfo?.deleted;
  }

  public isLoginAllowed(): boolean {
    return this.entityInfo && !this.entityInfo.deleted && this.isAccountActivated();
  }
}
