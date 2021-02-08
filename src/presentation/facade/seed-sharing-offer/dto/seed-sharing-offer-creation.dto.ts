import { CultivationPrinciple } from '@eg-domain-constants/cultivation-principle.enum';
import { ShareableReproductiveMaterial } from '@eg-domain-constants/shareable-reproductive-material.enum';
import { ApiProperty } from '@nestjs/swagger';

import { AddressDto } from './address.dto';
import { PhoneNumberDto } from './phone-number.dto';

export class SeedSharingOfferCreationDto {
  @ApiProperty({
    type: 'enum',
    enum: ShareableReproductiveMaterial,
    required: true,
  })
  public shareableReproductiveMaterial: ShareableReproductiveMaterial;

  @ApiProperty({
    type: 'enum',
    enum: CultivationPrinciple,
    required: false,
  })
  public cultivationPrinciple: CultivationPrinciple;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  public botanicalNodeId: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  public cultivarEpithet: string;

  @ApiProperty({
    type: PhoneNumberDto,
    required: false,
  })
  public phoneNumber: PhoneNumberDto;

  @ApiProperty({
    type: AddressDto,
    required: true,
  })
  public address: AddressDto;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  public description: string;
}
