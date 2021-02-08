import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { Injectable } from '@nestjs/common';

import { PhoneNumberDto } from '../dto/phone-number.dto';

@Injectable()
export class PhoneNumberMapper
  implements DtoMapper<PhoneNumberDto, PhoneNumber>, OntoEntityMapper<PhoneNumberDto, PhoneNumberDto> {
  public toDto(entity: PhoneNumber): PhoneNumberDto {
    const dto = new PhoneNumberDto();
    dto.phoneNo = entity.phoneNo ?? undefined;
    dto.countryCode = entity.countryCode ?? undefined;
    return dto;
  }

  public ontoEntity(dto: PhoneNumberDto, entity: PhoneNumber): PhoneNumber {
    if (!dto) {
      return entity;
    }
    if (!entity) {
      entity = new PhoneNumber();
    }
    entity.phoneNo = dto.phoneNo;
    entity.countryCode = dto.countryCode;
    return entity;
  }
}
