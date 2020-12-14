import { BotanicalFamilyI18n } from '@eg-domain/botanical-family/botanical-family-i18n';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.schema';
import { EntitySchema } from 'typeorm';

export const BotanicalFamilyI18nSchema = new EntitySchema<BotanicalFamilyI18n>({
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
