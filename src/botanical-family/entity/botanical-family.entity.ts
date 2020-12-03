import { EntityInfo } from 'src/core/core-data/entity/entity-info.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BotanicalFamilyI18nEntity } from './botanical-family-i18n.entity';

@Entity({ name: 'EG_BotanicalFamily' })
export class BotanicalFamilyEntity {
  @Column(() => EntityInfo, { prefix: '' })
  entityInfo: EntityInfo;

  @Column('varchar', { length: 200, nullable: false, unique: true })
  botanicalName: string;

  @OneToMany(
    () => BotanicalFamilyI18nEntity,
    (i18nData) => i18nData.botanicalFamily,
    {
      cascade: ['insert'],
    }
  )
  i18nData: BotanicalFamilyI18nEntity[];
}
