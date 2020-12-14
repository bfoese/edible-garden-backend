import { BotanicalSpeciesI18n } from '@eg-domain/botanical-species/botanical-species-i18n';
import { EntitySchema } from 'typeorm';
import { EntityInfoSchema } from '../../shared/schema/entity-info.schema';

export const BotanicalSpeciesI18nSchema = new EntitySchema<BotanicalSpeciesI18n>({
  name: 'botanicalSpeciesI18n',
  uniques: [
    {
      name: 'uq_botanicalspecies_locale',
      columns: ['languageCode', 'botanicalSpecies'],
    },
  ],
  columns: {
    ...EntityInfoSchema,

    languageCode: {
      type: 'varchar',
      length: 5,
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 200,
      nullable: false,
    },
  },
  relations: {
    botanicalSpecies: {
      type: 'many-to-one',
      target: 'botanicalSpecies',
      onDelete: 'CASCADE',
    },
  },
});
