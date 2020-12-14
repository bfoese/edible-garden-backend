import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { EntityRepository, Repository } from 'typeorm';
import { BotanicalSpeciesSchema } from '../schema/botanical-species.schema';

@EntityRepository(BotanicalSpeciesSchema)
export class BotanicalSpeciesTypeOrmRepository extends Repository<BotanicalSpecies> {}
