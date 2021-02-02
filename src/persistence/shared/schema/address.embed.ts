import { Address } from '@eg-domain/shared/adress';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const AddressSchema = (): EntitySchema<Address> =>
  new EntitySchema<Address>(<EntitySchemaOptions<Address>>{
    name: 'entityInfo',
    columns: {
      line1: {
        type: 'varchar',
        nullable: true,
      } as EntitySchemaColumnOptions,

      postalCode: {
        type: 'varchar',
        nullable: true,
      } as EntitySchemaColumnOptions,

      city: {
        type: 'varchar',
        nullable: true,
      } as EntitySchemaColumnOptions,

      countryCode: {
        type: 'varchar',
        length: 2,
        nullable: true,
      } as EntitySchemaColumnOptions,
    },
  });
