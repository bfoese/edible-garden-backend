import { EntityInfo } from '@eg-domain/shared/entity-info';
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

import { UserValidation } from './user-validation';

export class User {
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
  @MinLength(UserValidation.constraints.password.minLength)
  @Matches(UserValidation.constraints.password.pattern, { message: 'password too weak' })
  public password: string;
}
