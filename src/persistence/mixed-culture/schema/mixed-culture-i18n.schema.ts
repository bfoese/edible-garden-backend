import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { MixedCultureI18n } from '@eg-domain/mixed-culture/mixed-culture-i18n';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import {
  I18nEntitySchemaColumns,
  I18nEntitySchemaRelation,
  I18nEntitySchemaUnique,
} from '@eg-persistence/shared/schema/i18n-entity-info.partial';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const MixedCultureI18nSchema = new EntitySchema<MixedCultureI18n>(<EntitySchemaOptions<MixedCultureI18n>>{
  name: 'mixedCultureI18n',

  uniques: [I18nEntitySchemaUnique('mixedCulture')],
  embeddeds: {
    entityInfo: {
      isArray: false,
      type: (): EntitySchema<EntityInfo> => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    ...I18nEntitySchemaColumns<MixedCulture>(),

    description: {
      type: 'varchar',
      length: 2000,
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    ...I18nEntitySchemaRelation<MixedCulture>('mixedCulture', 'mixed_culture_id'),
  },
});
