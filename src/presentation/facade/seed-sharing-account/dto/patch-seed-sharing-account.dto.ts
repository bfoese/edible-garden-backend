import { AddressDto } from '@eg-presentation-facade/seed-sharing-offer/dto/address.dto';
import { PhoneNumberDto } from '@eg-presentation-facade/seed-sharing-offer/dto/phone-number.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PatchSeedSharingAccountDto {

  @ApiProperty({
    type: 'string',
    required: false
  })
  public preferredLocale: string;

  @ApiProperty({
    type: AddressDto,
    required: false
  })
  public address: AddressDto;

  @ApiProperty({
    type: PhoneNumberDto,
    required: false
  })
  public phoneNumber: PhoneNumberDto;
}
