import { EntityInfo } from 'src/core/core-data/entity/entity-info.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BotanicalFamilyEntity } from './botanical-family.entity';

@Entity({ name: 'EG_BotanicalFamilyI18n' })
@Unique('UQ_BotanicalFamilyI18n_botanicalFamily_langCode', [
  'languageCode',
  'botanicalFamily',
])
export class BotanicalFamilyI18nEntity {
  @Column(() => EntityInfo, { prefix: '' })
  entityInfo: EntityInfo;

  @ManyToOne(
    () => BotanicalFamilyEntity,
    (botanicalFamily) => botanicalFamily.i18nData
  )
  botanicalFamily: BotanicalFamilyEntity;

  @Column('varchar', { length: 5, nullable: false })
  languageCode: string;

  @Column('varchar', { length: 200, nullable: false })
  name: string;
}
