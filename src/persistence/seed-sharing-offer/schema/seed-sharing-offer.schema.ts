import { CultivationPrinciple } from '@eg-domain-constants/cultivation-principle.enum';
import { ShareableReproductiveMaterial } from '@eg-domain-constants/shareable-reproductive-material.enum';
import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { AddressSchema } from '@eg-persistence/shared/schema/address.embed';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { PhoneNumberSchema } from '@eg-persistence/shared/schema/phone-number.embed';
import { EntitySchema, EntitySchemaColumnOptions, EntitySchemaRelationOptions, JoinColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const SeedSharingOfferSchema = new EntitySchema<SeedSharingOffer>(<EntitySchemaOptions<SeedSharingOffer>>{
  name: 'seedSharingOffer',

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
    } as EntitySchemaEmbeddedOptions,

    phoneNumber: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => PhoneNumberSchema(),
      prefix: 'phone',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    shareableReproductiveMaterial: {
      type: 'enum',
      enum: ShareableReproductiveMaterial,
      nullable: true,
    } as EntitySchemaColumnOptions,

    cultivationPrinciple: {
      type: 'enum',
      enum: CultivationPrinciple,
      nullable: true,
    } as EntitySchemaColumnOptions,

    cultivarEpithet: {
      type: 'varchar',
      length: 200,
      nullable: true,
    } as EntitySchemaColumnOptions,

    description: {
      type: 'varchar',
      length: 1000,
      nullable: true,
    } as EntitySchemaColumnOptions,
  },

  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
      joinColumn: <JoinColumnOptions>{ name: 'user_id' },
    } as EntitySchemaRelationOptions,

    botanicalNode: {
      type: 'many-to-one',
      target: 'botanicalNode',
      joinColumn: <JoinColumnOptions>{ name: 'botanical_node_id' },
    } as EntitySchemaRelationOptions,
  },
});
