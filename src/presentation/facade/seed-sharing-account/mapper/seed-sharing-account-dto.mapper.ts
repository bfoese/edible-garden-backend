import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { User } from '@eg-domain/user/user';
import { AddressMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/address.mapper';
import { PhoneNumberMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/phone-number.mapper';
import { Injectable } from '@nestjs/common';

import { SeedSharingAccountDto } from '../dto/seed-sharing-account.dto';

@Injectable()
export class SeedSharingAccountDtoMapper implements DtoMapper<SeedSharingAccountDto, User> {
  public constructor(private addressMapper: AddressMapper, private phoneNumberMapper: PhoneNumberMapper) {}

  public toDto(entity: User): SeedSharingAccountDto {
    if (!entity) {
      return undefined;
    }
    const dto = new SeedSharingAccountDto();

    if ('entityInfo' in entity && 'id' in entity.entityInfo) {
      dto.userId = entity.entityInfo.id;
    }
    if ('email' in entity) {
      dto.email = entity.email;
    }
    if ('username' in entity) {
      dto.username = entity.username;
    }
    if ('preferredLocale' in entity) {
      dto.preferredLocale = entity.preferredLocale;
    }
    if ('address' in entity) {
      dto.address = this.addressMapper.toDto(entity?.address);
    }
    if ('phoneNumber' in entity) {
      dto.phoneNumber = this.phoneNumberMapper.toDto(entity.phoneNumber);
    }
    return dto;
  }
}
