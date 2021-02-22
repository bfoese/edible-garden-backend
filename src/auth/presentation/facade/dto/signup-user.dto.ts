import { UserValidation } from '@eg-domain/user/user-validation';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    type: 'string',
    minLength: UserValidation.constraints.username.minLength,
    maxLength: UserValidation.constraints.username.maxLength,
  })
  public username: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    type: 'string',
    example: 'foo@bar.baz',
  })
  public email: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    pattern: UserValidation.constraints.password.pattern.toString(),
  })
  public password: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    type: 'string'
  })
  public preferredLocale: string;
}
