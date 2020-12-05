import { EntityInfo } from '@eg-core/entity/entity-info.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BotanicalSpeciesEntity } from './botanical-species.entity';

@Entity({ name: 'eg_botanical_species_i18n' })
@Unique('uq_botanicalspecies_locale', ['languageCode', 'botanicalSpecies'])
export class BotanicalSpeciesI18nEntity {
  @Column(() => EntityInfo, { prefix: '' })
  public entityInfo: EntityInfo;

  @ManyToOne(() => BotanicalSpeciesEntity, (botanicalSpecies: BotanicalSpeciesEntity) => botanicalSpecies.i18nData, {
    onDelete: 'CASCADE',
  })
  public botanicalSpecies: BotanicalSpeciesEntity;

  @Column('varchar', { length: 5, nullable: false })
  public languageCode: string;

  @Column('varchar', { length: 200, nullable: false })
  public name: string;
}
