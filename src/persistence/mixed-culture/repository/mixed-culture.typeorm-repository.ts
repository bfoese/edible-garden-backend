import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { EntityRepository, Repository } from 'typeorm';
import { MixedCultureSchema } from '../schema/mixed-culture.schema';

@EntityRepository(MixedCultureSchema)
export class MixedCultureTypeOrmRepository extends Repository<MixedCulture> {}
