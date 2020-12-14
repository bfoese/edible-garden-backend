import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { EntityRepository, Repository } from 'typeorm';
import { BotanicalFamilySchema } from '../schema/botanical-family.schema';

@EntityRepository(BotanicalFamilySchema)
export class BotanicalFamilyTypeOrmRepository extends Repository<BotanicalFamily> {}
