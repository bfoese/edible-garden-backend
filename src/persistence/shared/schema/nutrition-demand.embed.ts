import { NutritionDemand } from '@eg-domain/growing-manual/nutrition-demand';
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const NutritionDemandSchema = (): EntitySchema<NutritionDemand> =>
  new EntitySchema<NutritionDemand>(<EntitySchemaOptions<NutritionDemand>>{
    name: 'nutritionDemand',
    columns: {
      value: {
        type: 'float',
        name: 'nutrition_demand',
      } as EntitySchemaColumnOptions,
    },
  });
