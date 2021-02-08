import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { Address } from '@eg-domain/shared/adress';
import { Injectable } from '@nestjs/common';

import { AddressDto } from '../dto/address.dto';

@Injectable()
export class AddressMapper implements DtoMapper<AddressDto, Address>, OntoEntityMapper<AddressDto, Address> {
  public toDto(entity: Address): AddressDto {
    const dto = new AddressDto();
    dto.line1 = entity.line1 ?? undefined;
    dto.city = entity.city ?? undefined;
    dto.postalCode = entity.postalCode ?? undefined;
    dto.countryCode = entity.countryCode ?? undefined;
    return dto;
  }

  public ontoEntity(dto: AddressDto, entity: Address): Address {
    if (!dto) {
      return entity;
    }
    if (!entity) {
      entity = new Address();
    }
    entity.city = dto.city;
    entity.countryCode = dto.countryCode;
    entity.line1 = dto.line1;
    entity.postalCode = dto.postalCode;
    return entity;
  }
}
