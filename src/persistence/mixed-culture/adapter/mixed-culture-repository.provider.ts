import { Provider } from '@nestjs/common';

import { MixedCultureRepositoryTypeOrmAdapter } from './mixed-culture-repository.typeorm.adapter';

export const MixedCultureRepositoryProvider: Provider = {
  provide: 'MixedCultureRepositoryTypeOrm',
  useClass: MixedCultureRepositoryTypeOrmAdapter,
};
