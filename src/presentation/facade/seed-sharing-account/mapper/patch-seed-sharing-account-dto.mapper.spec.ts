import { Address } from '@eg-domain/shared/adress';
import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { User } from '@eg-domain/user/user';
import { AddressDto } from '@eg-presentation-facade/seed-sharing-offer/dto/address.dto';
import { AddressMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/address.mapper';
import { PhoneNumberMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/phone-number.mapper';
import { AddressMockFactory } from '@eg-test-mocks/domain/address-mock.factory';
import { PhoneNumberMockFactory } from '@eg-test-mocks/domain/phone-number-mock.factory';
import { plainToClass } from 'class-transformer';

import { PatchSeedSharingAccountDto } from '../dto/patch-seed-sharing-account.dto';
import { PatchSeedSharingAccountDtoMapper } from './patch-seed-sharing-account-dto.mapper';

describe('PatchSeedSharingAccountDtoMapper', () => {
  const mapper: PatchSeedSharingAccountDtoMapper = new PatchSeedSharingAccountDtoMapper(
    new AddressMapper(),
    new PhoneNumberMapper()
  );
  let originalUserEntity: User;

  beforeEach(async () => {
    originalUserEntity = new User();
    originalUserEntity.address = AddressMockFactory.createDefault();
    originalUserEntity.preferredLocale = 'CZ';
    originalUserEntity.phoneNumber = PhoneNumberMockFactory.createDefault();
  });

  describe('ontoEntity', () => {
    it('should map all fields', () => {
      const patchDto = plainToClass(PatchSeedSharingAccountDto, {
        preferredLocale: 'de',
        address: { line1: 'Path to Ataraxia', city: 'Seneca' } as AddressDto,
        phoneNumber: { phoneNo: '123' },
      } as PatchSeedSharingAccountDto);

      const mappedUserEntity = mapper.ontoEntity(patchDto, originalUserEntity);

      expect(mappedUserEntity.preferredLocale).toBe(patchDto.preferredLocale);
      expect(JSON.stringify(mappedUserEntity.address)).toBe(
        JSON.stringify({ ...originalUserEntity.address, ...plainToClass(Address, patchDto.address) })
      );
      expect(JSON.stringify(mappedUserEntity.phoneNumber)).toBe(
        JSON.stringify({ ...originalUserEntity.phoneNumber, ...plainToClass(PhoneNumber, patchDto.phoneNumber) })
      );
    });

    it('should override only provided fields', () => {
      const patchDto = plainToClass(PatchSeedSharingAccountDto, {
        preferredLocale: 'de',
      } as PatchSeedSharingAccountDto);

      const mappedUserEntity = mapper.ontoEntity(patchDto, originalUserEntity);

      expect(mappedUserEntity.preferredLocale).toBe(patchDto.preferredLocale);
      expect(JSON.stringify(mappedUserEntity.address)).toBe(
        JSON.stringify({ ...originalUserEntity.address, ...plainToClass(Address, patchDto.address) })
      );
      expect(JSON.stringify(mappedUserEntity.phoneNumber)).toBe(
        JSON.stringify({ ...originalUserEntity.phoneNumber, ...plainToClass(PhoneNumber, patchDto.phoneNumber) })
      );
    });

    it('should reflect undefined value of dto property instead of not mapping the property', () => {
      const patchDto = plainToClass(PatchSeedSharingAccountDto, {
        preferredLocale: undefined,
      } as PatchSeedSharingAccountDto);

      const mappedUserEntity = mapper.ontoEntity(patchDto, originalUserEntity);

      expect(mappedUserEntity.preferredLocale).toBe(patchDto.preferredLocale);
      expect(JSON.stringify(mappedUserEntity.address)).toBe(JSON.stringify(originalUserEntity.address));
      expect(JSON.stringify(mappedUserEntity.phoneNumber)).toBe(JSON.stringify(originalUserEntity.phoneNumber));
    });
  });
});
