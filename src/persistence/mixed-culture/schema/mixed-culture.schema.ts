import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { EntitySchema, EntitySchemaColumnOptions, EntitySchemaRelationOptions, JoinColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

/**
 * TODO Unique constraint: combination of first_companion_id and
 * second_companion_id should be unique, also in reverse direction. Could be
 * done with function least/greatest but I think not possible in TypeORM right
 * now:
 *
 * create unique index uq_foo on mixedCulture(least(first_companion_id,
 * second_companion_id), greatest(first_companion_id, second_companion_id));
 */
export const MixedCultureSchema = new EntitySchema<MixedCulture>(<EntitySchemaOptions<MixedCulture>>{
  name: 'mixedCulture',

  uniques: [
    {
      name: 'uq_companion_id_combination',
      columns: ['firstCompanion', 'secondCompanion'],
    },
  ],

  embeddeds: {
    entityInfo: {
      isArray: false,
      type: (): EntitySchema<EntityInfo> => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    isDisadvantageous: {
      type: 'boolean',
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    i18nData: {
      type: 'one-to-many',
      target: 'mixedCultureI18n',
      cascade: ['insert', 'remove'],
      inverseSide: 'parent',
    } as EntitySchemaRelationOptions,

    firstCompanion: {
      type: 'many-to-one',
      target: 'botanicalNode',
      joinColumn: <JoinColumnOptions>{ name: 'first_companion_id' },
    } as EntitySchemaRelationOptions,

    secondCompanion: {
      type: 'many-to-one',
      target: 'botanicalNode',
      joinColumn: <JoinColumnOptions>{ name: 'second_companion_id' },
    } as EntitySchemaRelationOptions,
  },
});
