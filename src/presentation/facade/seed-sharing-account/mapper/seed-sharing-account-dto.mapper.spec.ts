import { User } from '@eg-domain/user/user';
import { AddressMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/address.mapper';
import { PhoneNumberMapper } from '@eg-presentation-facade/seed-sharing-offer/mapper/phone-number.mapper';
import { AddressMockFactory } from '@eg-test-mocks/domain/address-mock.factory';
import { PhoneNumberMockFactory } from '@eg-test-mocks/domain/phone-number-mock.factory';
import { plainToClass } from 'class-transformer';

import { SeedSharingAccountDto } from '../dto/seed-sharing-account.dto';
import { SeedSharingAccountDtoMapper } from './seed-sharing-account-dto.mapper';

describe('SeedSharingAccountDtoMapper', () => {
  const mapper: SeedSharingAccountDtoMapper = new SeedSharingAccountDtoMapper(
    new AddressMapper(),
    new PhoneNumberMapper()
  );

  let originalUserEntity: User;

  beforeEach(async () => {
    originalUserEntity = new User();
    originalUserEntity.address = AddressMockFactory.createDefault();
    originalUserEntity.preferredLocale = 'CZ';
    originalUserEntity.email = 'foo@bar.baz';
    originalUserEntity.phoneNumber = PhoneNumberMockFactory.createDefault();
  });

  describe('toDto', () => {
    it('should map all fields of an dto', () => {
      const dto = mapper.toDto(originalUserEntity);
      const dtoKeys = Object.keys(new SeedSharingAccountDto());
      dtoKeys.forEach((dtoKey: string) => expect(dto[dtoKey]).toBeDefined());
      dtoKeys.forEach((dtoKey: string) => expect(dto[dtoKey]).toBe(originalUserEntity[dtoKey]));
    });

    it('should not contain fields which are missing in source', () => {
      const emptyUserEntity = plainToClass(User, {});
      const dto = mapper.toDto(emptyUserEntity);
      const dtoKeys = Object.keys(dto);
      const entityKeys = Object.keys(emptyUserEntity);
      const intersectedProperties = dtoKeys.filter((value) => entityKeys.includes(value));
      expect(intersectedProperties.length).toBe(0);
    });
  });
});
