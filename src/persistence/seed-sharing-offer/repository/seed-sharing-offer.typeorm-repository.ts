import { SeedSharingOffer } from '@eg-domain/seed-sharing-offer/seed-sharing-offer';
import { EntityRepository, Repository } from 'typeorm';

import { SeedSharingOfferSchema } from '../schema/seed-sharing-offer.schema';

@EntityRepository(SeedSharingOfferSchema)
export class SeedSharingOfferTypeOrmRepository extends Repository<SeedSharingOffer> {}
