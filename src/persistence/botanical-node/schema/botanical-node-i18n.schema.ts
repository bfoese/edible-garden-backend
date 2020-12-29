import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeI18n } from '@eg-domain/botanical-node/botanical-node-i18n';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import {
  I18nEntitySchemaColumns,
  I18nEntitySchemaRelation,
  I18nEntitySchemaUnique,
} from '@eg-persistence/shared/schema/i18n-entity-info.partial';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const BotanicalNodeI18nSchema = new EntitySchema<BotanicalNodeI18n>(<EntitySchemaOptions<BotanicalNodeI18n>>{
  name: 'botanicalNodeI18n',

  uniques: [I18nEntitySchemaUnique('botanicalNode')],

  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    ...I18nEntitySchemaColumns<BotanicalNode>(),

    name: {
      type: 'varchar',
      length: 200,
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    ...I18nEntitySchemaRelation<BotanicalNode>('botanicalNode', 'botanical_node_id'),
  },
});
