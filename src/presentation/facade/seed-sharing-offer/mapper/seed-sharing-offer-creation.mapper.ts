import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { EntityInfoMapper } from '@eg-core/facade/mapper/entity-info.mapper';
import { UserMapper } from '@eg-core/facade/mapper/user.mapper';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { BotanicalNodeMapper } from '@eg-presentation-facade/botanical-node/mapper/botanical-node.mapper';
import { Injectable } from '@nestjs/common';

import { SeedSharingOfferCreationDto } from '../dto/seed-sharing-offer-creation.dto';
import { AddressMapper } from './address.mapper';
import { PhoneNumberMapper } from './phone-number.mapper';

@Injectable()
export class SeedSharingOfferCreationMapper implements OntoEntityMapper<SeedSharingOfferCreationDto, SeedSharingOffer> {
  public constructor(
    private entityInfoMapper: EntityInfoMapper,
    private addressMappter: AddressMapper,
    private phoneNumberMapper: PhoneNumberMapper,
    private botanicalNodeMapper: BotanicalNodeMapper,
    private userMapper: UserMapper
  ) {}

  public ontoEntity(dto: SeedSharingOfferCreationDto, entity: SeedSharingOffer): SeedSharingOffer {
    if (!entity) {
      entity = new SeedSharingOffer();
    }
    entity.cultivarEpithet = dto.cultivarEpithet;
    entity.description = dto.description;
    entity.shareableReproductiveMaterial = dto.shareableReproductiveMaterial;
    entity.cultivationPrinciple = dto.cultivationPrinciple;
    entity.address = this.addressMappter.ontoEntity(dto.address, entity.address);
    entity.phoneNumber = this.phoneNumberMapper.ontoEntity(dto.phoneNumber, entity.phoneNumber);
    // if (dto.user){
    //   entity.user = new User();
    //   entity.user.entityInfo.id = dto.user.entityInfo.id;
    // }
    if (dto.botanicalNodeId) {
      entity.botanicalNode = new BotanicalNode();
      entity.botanicalNode.entityInfo.id = dto.botanicalNodeId;
    }
    return entity;
  }
}
