import { EntityRepository, Repository } from 'typeorm';
import { BotanicalFamilyEntity } from '../entity/botanical-family.entity';

@EntityRepository(BotanicalFamilyEntity)
export class BotanicalFamilyEntityRepository extends Repository<
  BotanicalFamilyEntity
> {}
