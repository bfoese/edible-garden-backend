import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class SendAccountActionLinkDto {
  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    type: 'string',
    example: 'foo@bar.baz',
  })
  public email: string;

  @ApiProperty(<ApiPropertyOptions>{
    required: true,
    enum: ['ActivateAccount', 'ResetPassword', 'DeleteAccount'],
  })
  public purpose: AccountActionPurpose;
}
