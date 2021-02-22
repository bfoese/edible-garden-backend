import { Address } from '@eg-domain/shared/adress';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { Type } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';

import { IsLocaleEnabled } from '../../application/validation/validators/is-locale-enabled.validator';
import { UserValidation } from './user-validation';

export class User {
  public constructor() {
    this.entityInfo = new EntityInfo();
  }

  @Allow()
  @Type(() => EntityInfo)
  public entityInfo: EntityInfo;

  @IsEmail()
  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration],
  })
  public email: string;

  /**
   * Whether the email address was verified to be valid. Until this flag is
   * 'false' the user should not be able to sign in to the application. When the
   * user provides a new email address, either during sign up or later to change
   * the existing email address, this flag will be set to 'false' again until
   * the verification process of that new address was handled.
   */
  @IsBoolean()
  public isEmailVerified: boolean;

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

  @ValidateNested({ each: true })
  @Type(() => Address)
  public address: Address;

  @ValidateNested({ each: true })
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

  @IsNotEmpty({ groups: [UserValidation.groups.userRegistration, UserValidation.groups.updateAccountSettings] })
  @Validate(IsLocaleEnabled, {
    groups: [UserValidation.groups.userRegistration, UserValidation.groups.updateAccountSettings],
  })
  public preferredLocale: string;

  public isAccountActivated(): boolean {
    return this.entityInfo?.isActive;
  }

  public isAccountMarkedForDeletion(): boolean {
    return !!this.entityInfo?.deleted;
  }

  public isLoginAllowed(): boolean {
    return this.isEmailVerified && this.entityInfo && !this.isAccountMarkedForDeletion() && this.isAccountActivated();
  }
}
