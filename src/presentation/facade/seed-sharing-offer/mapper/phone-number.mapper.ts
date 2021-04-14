import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { Injectable } from '@nestjs/common';

import { PhoneNumberDto } from '../dto/phone-number.dto';

@Injectable()
export class PhoneNumberMapper
  implements DtoMapper<PhoneNumberDto, PhoneNumber>, OntoEntityMapper<PhoneNumberDto, PhoneNumberDto> {
  public toDto(entity: PhoneNumber): PhoneNumberDto | undefined {
    if (!entity) {
      return undefined;
    }
    const dto = new PhoneNumberDto();
    if ('phoneNo' in entity) {
      dto.phoneNo = entity.phoneNo;
    }
    if ('countryCode' in entity) {
      dto.countryCode = entity.countryCode;
    }
    return dto;
  }

  public ontoEntity(dto: PhoneNumberDto, entity: PhoneNumber): PhoneNumber {
    if (!dto) {
      return entity;
    }
    if (!entity) {
      entity = new PhoneNumber();
    }
    if ('phoneNo' in dto) {
      entity.phoneNo = dto.phoneNo;
    }
    if ('countryCode' in dto) {
      entity.countryCode = dto.countryCode;
    }
    return entity;
  }
}
