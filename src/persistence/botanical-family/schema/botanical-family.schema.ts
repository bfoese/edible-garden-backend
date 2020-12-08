import { BotanicalFamilyEntity } from 'src/types-persistence/botanical-family/botanical-family-entity.interface';
import { EntitySchema } from 'typeorm';
import { EntityInfoSchema } from './entity-info.schema';

export const BotanicalFamilySchema = new EntitySchema<BotanicalFamilyEntity>({
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
