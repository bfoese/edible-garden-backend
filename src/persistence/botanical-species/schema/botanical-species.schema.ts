import { BotanicalFamily } from '@eg-domain-constants/botanical-family.enum';
import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { EntitySchema } from 'typeorm';
import { EntityInfoSchema } from '../../shared/schema/entity-info.schema';

export const BotanicalSpeciesSchema = new EntitySchema<BotanicalSpecies>({
  name: 'botanicalSpecies',
  columns: {
    ...EntityInfoSchema,

    botanicalName: {
      type: 'varchar',
      length: 200,
      nullable: false,
      unique: true,
    },
    botanicalFamily: {
      type: 'enum',
      enum: BotanicalFamily,
      nullable: false,
    },
    edibleParts: {
      type: 'enum',
      enum: EdiblePart,
      array: true,
      nullable: true,
    },
    nutritionDemand: {
      type: 'enum',
      enum: NutritionDemand,
      nullable: true,
    },
  },
  relations: {
    i18nData: {
      type: 'one-to-many',
      target: 'botanicalSpeciesI18n',
      cascade: ['insert'],
    },
  },
});
