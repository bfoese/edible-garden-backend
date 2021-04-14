import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { Address } from '@eg-domain/shared/adress';
import { Injectable } from '@nestjs/common';

import { AddressDto } from '../dto/address.dto';

@Injectable()
export class AddressMapper implements DtoMapper<AddressDto, Address>, OntoEntityMapper<AddressDto, Address> {
  public toDto(entity: Address): AddressDto | undefined {
    if (!entity) {
      return undefined;
    }
    const dto = new AddressDto();
    if ('line1' in entity) {
      dto.line1 = entity.line1;
    }
    if ('city' in entity) {
      dto.city = entity.city;
    }
    if ('postalCode' in entity) {
      dto.postalCode = entity.postalCode;
    }
    if ('countryCode' in entity) {
      dto.countryCode = entity.countryCode;
    }
    return dto;
  }

  public ontoEntity(dto: AddressDto, entity: Address): Address {
    if (!dto) {
      return entity;
    }
    if (!entity) {
      entity = new Address();
    }
    if ('city' in dto) {
      entity.city = dto.city;
    }
    if ('countryCode' in dto) {
      entity.countryCode = dto.countryCode;
    }
    if ('line1' in dto) {
      entity.line1 = dto.line1;
    }
    if ('postalCode' in dto) {
      entity.postalCode = dto.postalCode;
    }
    return entity;
  }
}
