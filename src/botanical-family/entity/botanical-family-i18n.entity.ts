import { EntityInfo } from '@eg-core/entity/entity-info.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BotanicalFamilyEntity } from './botanical-family.entity';

@Entity({ name: 'eg_botanical_family_i18n' })
@Unique('uq_botanicalfamily_locale', ['languageCode', 'botanicalFamily'])
export class BotanicalFamilyI18nEntity {
  @Column(() => EntityInfo, { prefix: '' })
  public entityInfo: EntityInfo;

  @ManyToOne(() => BotanicalFamilyEntity, (botanicalFamily: BotanicalFamilyEntity) => botanicalFamily.i18nData, {
    onDelete: 'CASCADE',
  })
  public botanicalFamily: BotanicalFamilyEntity;

  @Column('varchar', { length: 5, nullable: false })
  public languageCode: string;

  @Column('varchar', { length: 200, nullable: false })
  public name: string;
}
