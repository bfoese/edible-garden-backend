import { ApiProperty } from '@nestjs/swagger';

export class PhoneNumberDto {
  @ApiProperty({
    type: 'string',
  })
  public phoneNo: string;

  @ApiProperty({
    type: 'string',
    minLength: 2,
    maxLength: 2,
  })
  public countryCode: number;
}
