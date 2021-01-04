import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { EntityRepository, Repository } from 'typeorm';
import { GrowingManualSchema } from '../schema/growing-manual.schema';

@EntityRepository(GrowingManualSchema)
export class GrowingManualTypeOrmRepository extends Repository<GrowingManual> {}
