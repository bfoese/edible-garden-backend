import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.embed';
import { EntitySchema, EntitySchemaColumnOptions, EntitySchemaRelationOptions, JoinColumnOptions } from 'typeorm';
import { EntitySchemaEmbeddedOptions } from 'typeorm/entity-schema/EntitySchemaEmbeddedOptions';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const BotanicalSpeciesInfoSchema = new EntitySchema<BotanicalSpeciesInfo>(<
  EntitySchemaOptions<BotanicalSpeciesInfo>
>{
  name: 'botanicalSpeciesInfo',

  embeddeds: {
    entityInfo: {
      isArray: false,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      type: () => EntityInfoSchema(),
      prefix: '',
    } as EntitySchemaEmbeddedOptions,
  },
  columns: {
    edibleParts: {
      type: 'enum',
      enum: EdiblePart,
      array: true,
      nullable: true,
    } as EntitySchemaColumnOptions,

    nutritionDemand: {
      type: 'enum',
      enum: NutritionDemand,
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
      target: 'botanicalSpeciesInfoI18n',
      cascade: ['insert'],
      inverseSide: 'parent',
    } as EntitySchemaRelationOptions,

    botanicalSpecies: {
      type: 'one-to-one',
      target: 'botanicalNode',
      cascade: ['insert'],
      joinColumn: <JoinColumnOptions>{ name: 'botanical_species_id' },
    } as EntitySchemaRelationOptions,
  },
});
