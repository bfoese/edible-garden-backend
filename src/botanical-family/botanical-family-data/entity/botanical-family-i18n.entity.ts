import { EntityInfo } from 'src/core/core-data/entity/entity-info.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BotanicalFamilyEntity } from './botanical-family.entity';

@Entity({ name: 'EG_BotanicalFamilyI18n' })
export class BotanicalFamilyI18nEntity {
  @Column(() => EntityInfo, { prefix: '' })
  entityInfo: EntityInfo;

  @ManyToOne(
    () => BotanicalFamilyEntity,
    (botanicalFamily) => botanicalFamily.i18nData,
  )
  botanicalFamily: BotanicalFamilyEntity;

  @Column('varchar', { length: 5, nullable: false, unique: true })
  languageCode: string;

  @Column('varchar', { length: 200, nullable: false })
  name: string;
}
