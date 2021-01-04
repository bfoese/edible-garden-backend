import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { NutritionDemand } from '@eg-domain/growing-manual/nutrition-demand';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { NutritionDemandSchema } from '@eg-persistence/shared/schema/nutrition-demand.embed';
import { EntitySchema, EntitySchemaColumnOptions, EntitySchemaRelationOptions, JoinColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const GrowingManualSchema = new EntitySchema<GrowingManual>(<EntitySchemaOptions<GrowingManual>>{
  name: 'growingManual',

  embeddeds: {
    entityInfo: {
      isArray: false,
      type: (): EntitySchema<EntityInfo> => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,

    nutritionDeand: {
      isArray: false,
      type: (): EntitySchema<NutritionDemand> => NutritionDemandSchema(),
      prefix: '',
    },
  },
  columns: {
    edibleParts: {
      type: 'enum',
      enum: EdiblePart,
      array: true,
      nullable: true,
    } as EntitySchemaColumnOptions,

    isBeePasture: {
      type: 'boolean',
      nullable: true,
    } as EntitySchemaColumnOptions,

    isGreenManure: {
      type: 'boolean',
      nullable: true,
    } as EntitySchemaColumnOptions,
  },
  relations: {
    i18nData: {
      type: 'one-to-many',
      target: 'growingManualI18n',
      cascade: ['insert', 'remove'],
      inverseSide: 'parent',
    } as EntitySchemaRelationOptions,

    botanicalNode: {
      type: 'one-to-one',
      target: 'botanicalNode',
      cascade: ['insert'],
      joinColumn: <JoinColumnOptions>{ name: 'botanical_node_id' },
    } as EntitySchemaRelationOptions,
  },
});
