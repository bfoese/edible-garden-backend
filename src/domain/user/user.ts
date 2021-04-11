import { IsLocaleEnabled } from '@eg-app/validation/validators/is-locale-enabled.validator';
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
  ValidateNested,
} from 'class-validator';

import { AccountAuthProvider } from './account-auth-provider';
import { UserValidation } from './user-validation';

export class User {
  public constructor() {
    this.entityInfo = new EntityInfo();
  }

  @Allow()
  @Type(() => EntityInfo)
  public entityInfo: EntityInfo;

  /**
   * Email address of the user. When the user registered through an external
   * auth provider, this field contains the email address that was provided by
   * the external provider. This field will be updated on every login with an
   * external provider, in case the provider communicates a new email address.
   * The email is unique per auth provider, implying a user could create multiple
   * accounts by using different auth providers.
   */
  @IsEmail()
  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration, UserValidation.groups.userExtAuthProviderRegistration],
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

  /**
   * The username is being used as a "display name". Users can use it to
   * obfuscate their real identity. By default, users will be represented by
   * their display name within the app and they can choose to use their real
   * name for it. The display name can be changed but I would prefer it to be
   * "unique", otherwise a user could pretend to be another user by using the
   * same username. I used "unique" in quotation mark to emphasize a
   * semi-uniqueness. Because with the integration of multiple auth providers,
   * there is no chance to guarantee a globally unique username/display name
   * within the application. It can only be unique per auth provider.
   */
  @Length(UserValidation.constraints.username.minLength, UserValidation.constraints.username.maxLength)
  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration, UserValidation.groups.userExtAuthProviderRegistration],
  })
  public username: string;

  @IsNotEmpty({
    groups: [UserValidation.groups.userRegistration, UserValidation.groups.updatePassword],
  })
  @IsString()
  @Matches(UserValidation.constraints.password.pattern, { message: 'password too weak' })
  public password: string;

  @ValidateNested({ each: true })
  @IsNotEmpty({
    groups: [UserValidation.groups.userExtAuthProviderRegistration],
  })
  // @Allow()
  @Type(() => AccountAuthProvider)
  public accountAuthProviders: undefined | AccountAuthProvider[];

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
  @IsLocaleEnabled({
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
