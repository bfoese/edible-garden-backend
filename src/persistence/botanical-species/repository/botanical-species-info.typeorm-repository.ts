import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { EntityRepository, Repository } from 'typeorm';
import { BotanicalSpeciesInfoSchema } from '../schema/botanical-species-info.schema';

@EntityRepository(BotanicalSpeciesInfoSchema)
export class BotanicalSpeciesInfoTypeOrmRepository extends Repository<BotanicalSpeciesInfo> {}
