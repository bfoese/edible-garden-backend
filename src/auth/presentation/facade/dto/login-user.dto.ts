import { UserValidation } from '@eg-domain/user/user-validation';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Provide the unique username or email',
    required: true,
    type: 'string',
  })
  public username: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    minLength: UserValidation.constraints.password.minLength,
    pattern: UserValidation.constraints.password.pattern.toString(),
  })
  public password: string;
}
