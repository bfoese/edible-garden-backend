import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { EntityRepository, Repository } from 'typeorm';
import { BotanicalNodeSchema } from '../schema/botanical-node.schema';

@EntityRepository(BotanicalNodeSchema)
export class BotanicalNodeTypeOrmRepository extends Repository<BotanicalNode> {}
