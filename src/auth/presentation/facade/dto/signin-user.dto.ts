import { UserValidation } from '@eg-domain/user/user-validation';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class SigninUserDto {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Provide the unique username or email',
    required: true,
    type: 'string',
  })
  public username: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    pattern: UserValidation.constraints.password.pattern.toString(),
  })
  public password: string;
}
