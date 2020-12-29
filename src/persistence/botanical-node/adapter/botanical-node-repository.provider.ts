import { Provider } from '@nestjs/common';
import { BotanicalNodeRepositoryTypeOrmAdapter } from './botanical-node-repository.typeorm.adapter';

export const BotanicalNodeRepositoryProvider: Provider = {
  provide: 'BotanicalNodeRepositoryTypeOrm',
  useClass: BotanicalNodeRepositoryTypeOrmAdapter,
};
