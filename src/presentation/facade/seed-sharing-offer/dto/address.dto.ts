import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    type: 'string',
  })
  public line1: string;

  @ApiProperty({
    type: 'string',
  })
  public postalCode: string;

  @ApiProperty({
    type: 'string',
  })
  public city: string;

  @ApiProperty({
    type: 'string',
    minLength: 2,
    maxLength: 2,
  })
  public countryCode: string;
}
