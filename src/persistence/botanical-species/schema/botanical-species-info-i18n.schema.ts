import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { BotanicalSpeciesInfoI18n } from '@eg-domain/botanical-species-info/botanical-species-info-i18n';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import {
  I18nEntitySchemaColumns,
  I18nEntitySchemaRelation,
  I18nEntitySchemaUnique,
} from '@eg-persistence/shared/schema/i18n-entity-info.partial';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const BotanicalSpeciesInfoI18nSchema = new EntitySchema<BotanicalSpeciesInfoI18n>(<
  EntitySchemaOptions<BotanicalSpeciesInfoI18n>
>{
  name: 'botanicalSpeciesInfoI18n',

  uniques: [I18nEntitySchemaUnique('botanicalSpeciesInfo')],
  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    ...I18nEntitySchemaColumns<BotanicalSpeciesInfo>(),

    name: {
      type: 'varchar',
      length: 200,
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    ...I18nEntitySchemaRelation<BotanicalSpeciesInfo>('botanicalSpeciesInfo', 'botanical_species_info_id'),
  },
});
