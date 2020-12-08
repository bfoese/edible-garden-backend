import { BotanicalFamilyI18nEntity } from 'src/types-persistence/botanical-family/botanical-family-i18n-entity.interface';
import { EntityRepository, Repository } from 'typeorm';
import { BotanicalFamilyI18nSchema } from '../schema/botanical-family-i18n.schema';

@EntityRepository(BotanicalFamilyI18nSchema)
export class BotanicalFamilyI18nTypeOrmRepository extends Repository<BotanicalFamilyI18nEntity> {}
