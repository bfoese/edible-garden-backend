import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { User } from '@eg-domain/user/user';
import { AddressMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/address.mapper';
import { PhoneNumberMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/phone-number.mapper';
import { Injectable } from '@nestjs/common';

import { PatchSeedSharingAccountDto } from '../dto/patch-seed-sharing-account.dto';

@Injectable()
export class PatchSeedSharingAccountDtoMapper implements OntoEntityMapper<PatchSeedSharingAccountDto, User> {
  public constructor(private addressMapper: AddressMapper, private phoneNumberMapper: PhoneNumberMapper) {}

  public ontoEntity(dto: PatchSeedSharingAccountDto, entity: User): User {

    if (!dto) {
      return entity;
    }

    if ('preferredLocale' in dto) {
      entity.preferredLocale = dto.preferredLocale;
    }
    if ('address' in dto) {
      const address = this.addressMapper.ontoEntity(dto.address, entity.address);
      entity.address = address;
    }

    if ('phoneNumber' in dto) {
      const phone = this.phoneNumberMapper.ontoEntity(dto.phoneNumber, entity.phoneNumber);
      entity.phoneNumber = phone;
    }
    return entity;
  }
}
