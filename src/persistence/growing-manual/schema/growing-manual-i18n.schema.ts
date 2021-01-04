import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { GrowingManualI18n } from '@eg-domain/growing-manual/growing-manual-i18n';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import {
  I18nEntitySchemaColumns,
  I18nEntitySchemaRelation,
  I18nEntitySchemaUnique,
} from '@eg-persistence/shared/schema/i18n-entity-info.partial';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const GrowingManualI18nSchema = new EntitySchema<GrowingManualI18n>(<EntitySchemaOptions<GrowingManualI18n>>{
  name: 'growingManualI18n',

  uniques: [I18nEntitySchemaUnique('growingManual')],
  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    ...I18nEntitySchemaColumns<GrowingManual>(),

    name: {
      type: 'varchar',
      length: 200,
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    ...I18nEntitySchemaRelation<GrowingManual>('growingManual', 'growing_manual_id'),
  },
});
