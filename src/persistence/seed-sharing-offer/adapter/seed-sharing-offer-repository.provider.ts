import { Provider } from '@nestjs/common';

import { SeedSharingOfferRepositoryTypeOrmAdapter } from './seed-sharing-offer-repository.typeorm.adapter';

export const SeedSharingOfferRepositoryProvider: Provider = {
  provide: 'SeedSharingOfferRepositoryTypeOrm',
  useClass: SeedSharingOfferRepositoryTypeOrmAdapter,
};
