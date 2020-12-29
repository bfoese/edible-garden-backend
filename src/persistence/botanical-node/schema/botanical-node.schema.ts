import { TaxonomicRank } from '@eg-domain-constants/taxonomic-rank.enum';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { EntitySchema, EntitySchemaColumnOptions, EntitySchemaRelationOptions, JoinColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const BotanicalNodeSchema = new EntitySchema<BotanicalNode>(<EntitySchemaOptions<BotanicalNode>>{
  name: 'botanicalNode',
  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    botanicalName: {
      type: 'varchar',
      length: 200,
      nullable: false,
      unique: true,
    } as EntitySchemaColumnOptions,

    taxonomicRank: {
      type: 'enum',
      enum: TaxonomicRank,
      nullable: false,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    i18nData: {
      type: 'one-to-many',
      target: 'botanicalNodeI18n',
      cascade: ['insert'],
      inverseSide: 'parent',
    } as EntitySchemaRelationOptions,

    parent: {
      type: 'many-to-one',
      target: 'botanicalNode',
      cascade: ['insert'],
      // inverseSide: 'botanicalNode',
      joinColumn: <JoinColumnOptions>{ name: 'parent_id' },
    } as EntitySchemaRelationOptions,
  },
});
