import { BotanicalFamilyEntity } from 'src/types-persistence/botanical-family/botanical-family-entity.interface';
import { EntityRepository, Repository } from 'typeorm';
import { BotanicalFamilySchema } from '../schema/botanical-family.schema';

@EntityRepository(BotanicalFamilySchema)
export class BotanicalFamilyTypeOrmRepository extends Repository<BotanicalFamilyEntity> {}
