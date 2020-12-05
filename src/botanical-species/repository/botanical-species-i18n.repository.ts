import { EntityRepository, Repository } from 'typeorm';
import { BotanicalSpeciesI18nEntity } from '../entity/botanical-species-i18n.entity';

@EntityRepository(BotanicalSpeciesI18nEntity)
export class BotanicalSpeciesI18nEntityRepository extends Repository<BotanicalSpeciesI18nEntity> {}
