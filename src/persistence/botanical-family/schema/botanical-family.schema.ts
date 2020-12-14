import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { EntityInfoSchema } from '@eg-persistence/shared/schema/entity-info.schema';
import { EntitySchema } from 'typeorm';

export const BotanicalFamilySchema = new EntitySchema<BotanicalFamily>({
  name: 'botanicalFamily',
  columns: {
    ...EntityInfoSchema,

    botanicalName: {
      type: 'varchar',
      length: 200,
      nullable: false,
      unique: true,
    },
  },
  relations: {
    i18nData: {
      type: 'one-to-many',
      target: 'botanicalFamilyI18n',
      cascade: ['insert'],
    },
  },
});
