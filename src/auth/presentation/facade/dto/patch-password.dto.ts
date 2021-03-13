import { UserValidation } from '@eg-domain/user/user-validation';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Used to transfer a new passwort from the client to the server. The user
 * resource is encoded within the token. The client will be provided with the
 * token when the server initates the process of resetting the password.
 */
export class PatchPasswordDto {
  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    pattern: UserValidation.constraints.password.pattern.toString(),
  })
  public password: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    type: 'string',
    description: 'Token that was provided by the server to the client when the server initiated the password change process.'
  })
  public token: string;
}
