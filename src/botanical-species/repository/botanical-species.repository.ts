import { EntityRepository, Repository } from 'typeorm';
import { BotanicalSpeciesEntity } from '../entity/botanical-species.entity';

@EntityRepository(BotanicalSpeciesEntity)
export class BotanicalSpeciesEntityRepository extends Repository<BotanicalSpeciesEntity> {}
