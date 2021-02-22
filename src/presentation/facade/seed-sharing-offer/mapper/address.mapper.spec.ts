import { Address } from '@eg-domain/shared/adress';
import { plainToClass } from 'class-transformer';

import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from './address.mapper';

describe('AddressMapper', () => {
  let addressMapper: AddressMapper = new AddressMapper();

  const addressEntity: Address = new Address();
  addressEntity.city = 'Utopia';
  addressEntity.countryCode = 'UT';
  addressEntity.line1 = 'Road to imagination 100';
  addressEntity.postalCode = '54321';

  beforeEach(async () => {
    addressMapper = new AddressMapper();
  });

  describe('toDto', () => {
    it('should map all fields of an dto', () => {
      const addressEntity = plainToClass(Address, {
        city: 'Utopia',
        countryCode: 'UT',
        line1: 'Road to imagination 100',
        postalCode: '54321',
      } as Address);

      const dto = addressMapper.toDto(addressEntity);
      const dtoKeys = Object.keys(new AddressDto());
      dtoKeys.forEach((dtoKey: string) => expect(dto[dtoKey]).toBeDefined());
      dtoKeys.forEach((dtoKey: string) => expect(dto[dtoKey]).toBe(addressEntity[dtoKey]));
    });
  });

  describe('ontoEntity', () => {
    it('should map all fields of an entity', () => {
      const addressDto = plainToClass(AddressDto, {
        city: 'Utopia',
        countryCode: 'UT',
        line1: 'Road to imagination 100',
        postalCode: '54321',
      } as AddressDto);

      const entity = addressMapper.ontoEntity(addressDto, null);
      const entityKeys = Object.keys(new Address());
      entityKeys.forEach((key: string) => expect(entity[key]).toBeDefined());
      entityKeys.forEach((key: string) => expect(entity[key]).toBe(addressDto[key]));
    });

    it('should override only provided fields', () => {
      const addressDto = plainToClass(AddressDto, {
        city: 'Utopia',
      } as AddressDto);

      const entity = addressMapper.ontoEntity(
        addressDto,
        plainToClass(Address, { city: 'Dystopia', line1: 'Cul de sac' } as Address)
      );
      const entityKeys = Object.keys(new Address());
      entityKeys.forEach((key: string) => {
        switch (key) {
          case 'city':
            expect(entity[key]).toBe('Utopia');
          case 'line1':
            expect(entity[key]).toBe('Cul de sac');
          default:
            expect(entity[key]).toBeUndefined();
        }
      });
    });
  });
});
