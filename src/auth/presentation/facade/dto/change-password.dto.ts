import { UserValidation } from '@eg-domain/user/user-validation';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    pattern: UserValidation.constraints.password.pattern.toString(),
  })
  public password: string;
}
