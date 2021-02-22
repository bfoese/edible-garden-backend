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
    const dto = new SeedSharingAccountDto();

    dto.userId = entity?.entityInfo?.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.preferredLocale = entity.preferredLocale;
    dto.address = this.addressMapper.toDto(entity?.address);
    dto.phoneNumber = this.phoneNumberMapper.toDto(entity?.phoneNumber);
    return dto;
  }
}
