import { EntityInfoDto } from '@eg-core/facade/dto/entity-info.dto';
import { UserDto } from '@eg-core/facade/dto/user.dto';
import { CultivationPrinciple } from '@eg-domain-constants/cultivation-principle.enum';
import { ShareableReproductiveMaterial } from '@eg-domain-constants/shareable-reproductive-material.enum';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { ApiProperty } from '@nestjs/swagger';

import { AddressDto } from './address.dto';
import { PhoneNumberDto } from './phone-number.dto';

export class SeedSharingOfferDto {
  @ApiProperty({
    type: EntityInfoDto,
    required: false,
  })
  public entityInfo: EntityInfoDto;

  @ApiProperty({
    type: UserDto,
    required: false,
  })
  public user: UserDto;

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
    type: BotanicalNodeDto,
    required: false,
  })
  public botanicalNode: BotanicalNodeDto;

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
