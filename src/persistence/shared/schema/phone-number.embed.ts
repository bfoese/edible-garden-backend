import { PhoneNumber } from '@eg-domain/shared/phone-number';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

import { EncryptedValueTransformer } from '../value-transformer/encrypted-value-transformer';

export const PhoneNumberSchema = (): EntitySchema<PhoneNumber> =>
  new EntitySchema<PhoneNumber>(<EntitySchemaOptions<PhoneNumber>>{
    name: 'phone',
    columns: {
      phoneNo: {
        type: 'varchar',
        nullable: true,
        transformer: new EncryptedValueTransformer(),
      } as EntitySchemaColumnOptions,

      countryCode: {
        type: 'integer',
        nullable: true,
      } as EntitySchemaColumnOptions,
    },
  });
