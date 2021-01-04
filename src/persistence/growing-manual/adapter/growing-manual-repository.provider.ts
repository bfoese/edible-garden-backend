import { Provider } from '@nestjs/common';

import { GrowingManualRepositoryTypeOrmAdapter } from './growing-manual-repository.typeorm.adapter';

export const GrowingManualRepositoryProvider: Provider = {
  provide: 'GrowingManualRepositoryTypeOrm',
  useClass: GrowingManualRepositoryTypeOrmAdapter,
};
