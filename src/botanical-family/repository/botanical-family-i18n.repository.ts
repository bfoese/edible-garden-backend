import { EntityRepository, Repository } from 'typeorm';
import { BotanicalFamilyI18nEntity } from '../entity/botanical-family-i18n.entity';

@EntityRepository(BotanicalFamilyI18nEntity)
export class BotanicalFamilyI18nEntityRepository extends Repository<BotanicalFamilyI18nEntity> {}
