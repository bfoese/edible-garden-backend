import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { EntityInfoMapper } from '@eg-core/facade/mapper/entity-info.mapper';
import { UserMapper } from '@eg-core/facade/mapper/user.mapper';
import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { BotanicalNodeMapper } from '@eg-presentation-facade/botanical-node/mapper/botanical-node.mapper';
import { Injectable } from '@nestjs/common';

import { SeedSharingOfferDto } from '../dto/seed-sharing-offer.dto';
import { AddressMapper } from './address.mapper';
import { PhoneNumberMapper } from './phone-number.mapper';

@Injectable()
export class SeedSharingOfferMapper
  implements DtoMapper<SeedSharingOfferDto, SeedSharingOffer>, OntoEntityMapper<SeedSharingOfferDto, SeedSharingOffer> {
  public constructor(
    private entityInfoMapper: EntityInfoMapper,
    private addressMappter: AddressMapper,
    private phoneNumberMapper: PhoneNumberMapper,
    private botanicalNodeMapper: BotanicalNodeMapper,
    private userMapper: UserMapper
  ) {}

  public toDto(entity: SeedSharingOffer): SeedSharingOfferDto {
    if (!entity) {
      return undefined;
    }

    const dto = new SeedSharingOfferDto();
    dto.cultivationPrinciple = entity.cultivationPrinciple ?? undefined;
    dto.cultivarEpithet = entity.cultivarEpithet ?? undefined;
    dto.description = entity.description ?? undefined;
    dto.shareableReproductiveMaterial = entity.shareableReproductiveMaterial ?? undefined;

    if (entity.entityInfo) {
      dto.entityInfo = this.entityInfoMapper.toDto(entity.entityInfo);
    }

    if (entity.address) {
      dto.address = this.addressMappter.toDto(entity.address);
    }

    if (entity.phoneNumber) {
      dto.phoneNumber = this.phoneNumberMapper.toDto(entity.phoneNumber);
    }

    if (entity.botanicalNode) {
      dto.botanicalNode = this.botanicalNodeMapper.toDto(entity.botanicalNode);
    }

    if (entity.user) {
      dto.user = this.userMapper.toDto(entity.user);
    }
    return dto;
  }

  public ontoEntity(dto: SeedSharingOfferDto, entity: SeedSharingOffer): SeedSharingOffer {
    if (!entity) {
      entity = new SeedSharingOffer();
    }
    entity.cultivarEpithet = dto.cultivarEpithet;
    entity.description = dto.description;
    entity.shareableReproductiveMaterial = dto.shareableReproductiveMaterial;
    entity.cultivationPrinciple = dto.cultivationPrinciple;
    entity.address = this.addressMappter.ontoEntity(dto.address, entity.address);
    entity.phoneNumber = this.phoneNumberMapper.ontoEntity(dto.phoneNumber, entity.phoneNumber);
    // TODO botanical node, user
    return entity;
  }
}
