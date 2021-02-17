import { AddressDto } from '@eg-presentation-facade/seed-sharing-offer/dto/address.dto';
import { PhoneNumberDto } from '@eg-presentation-facade/seed-sharing-offer/dto/phone-number.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SeedSharingAccountDto {

  @ApiProperty({
    type: 'string',
  })
  public userId: string;

  @ApiProperty({
    type: 'string',
  })
  public username: string;

  @ApiProperty({
    type: 'string',
  })
  public email: string;

  @ApiProperty({
    type: 'string',
  })
  public preferredLocale: string;

  @ApiProperty({
    type: AddressDto,
  })
  public address: AddressDto;

  @ApiProperty({
    type: PhoneNumberDto,
  })
  public phoneNumber: PhoneNumberDto;
}
