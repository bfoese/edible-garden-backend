import { EntitySchemaUniqueOptions } from '@bfoese/typeorm/entity-schema/EntitySchemaUniqueOptions';
import { User } from '@eg-domain/user/user';
import { AddressSchema } from '@eg-persistence/shared/schema/address.embed';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { PhoneNumberSchema } from '@eg-persistence/shared/schema/phone-number.embed';
import { EncryptedValueTransformer } from '@eg-persistence/shared/value-transformer/encrypted-value-transformer';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const UserSchema = new EntitySchema<User>(<EntitySchemaOptions<User>>{
  name: 'user',

  uniques: [
    <EntitySchemaUniqueOptions>{ name: 'UQ_username', columns: ['username'] },
    <EntitySchemaUniqueOptions>{ name: 'UQ_email', columns: ['email'] },
  ],

  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,

    address: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => AddressSchema(),
      prefix: 'address',
      transformer: new EncryptedValueTransformer(),
      select: false, // senstive personal data; only needed for few use cases
    } as EntitySchemaEmbeddedOptions,

    phoneNumber: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => PhoneNumberSchema(),
      prefix: 'phone',
      transformer: new EncryptedValueTransformer(),
      select: false, // senstive personal data; only needed for few use cases
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    email: {
      type: 'varchar',
      nullable: false,
      transformer: new EncryptedValueTransformer(),
      select: false, // senstive personal data; only needed for few use cases
    } as EntitySchemaColumnOptions,

    isEmailVerified: {
      type: 'boolean',
      nullable: false,
      default: false
    } as EntitySchemaColumnOptions,

    username: {
      type: 'varchar',
      length: 20,
      nullable: false,
    } as EntitySchemaColumnOptions,

    password: {
      type: 'varchar',
      length: 200,
      nullable: false,
      select: false // vulnerable information; only needed for few use cases
    } as EntitySchemaColumnOptions,

    preferredLocale: {
      type: 'varchar',
      length: 5,
      nullable: true,
    } as EntitySchemaColumnOptions,

    accountActionToken: {
      type: 'varchar',
      nullable: true,
      select: false, // vulnerable information; only needed for few use cases
    } as EntitySchemaColumnOptions,
  },
});
