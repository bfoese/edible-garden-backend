import { BotanicalFamilyI18nEntity } from 'src/types-persistence/botanical-family/botanical-family-i18n-entity.interface';
import { EntitySchema } from 'typeorm';
import { EntityInfoSchema } from './entity-info.schema';

export const BotanicalFamilyI18nSchema = new EntitySchema<BotanicalFamilyI18nEntity>({
  name: 'botanicalFamilyI18n',
  uniques: [
    {
      name: 'uq_botanicalfamily_locale',
      columns: ['languageCode', 'botanicalFamily'],
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
    botanicalFamily: {
      type: 'many-to-one',
      target: 'botanicalFamily',
      onDelete: 'CASCADE',
    },
  },
});
