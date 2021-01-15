import { Provider } from '@nestjs/common';

import { UserRepositoryTypeOrmAdapter } from './user-repository.typeorm.adapter';

export const UserRepositoryProvider: Provider = {
  provide: 'UserRepositoryTypeOrm',
  useClass: UserRepositoryTypeOrmAdapter,
};
