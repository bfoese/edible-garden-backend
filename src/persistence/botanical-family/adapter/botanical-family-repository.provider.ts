import { Provider } from '@nestjs/common';
import { BotanicalFamilyRepositoryTypeOrmAdapter } from './botanical-family-repository.typeorm.adapter';

export const BotanicalFamilyRepositoryProvider: Provider = {
  provide: 'BotanicalFamilyRepositoryTypeOrm',
  useClass: BotanicalFamilyRepositoryTypeOrmAdapter,
};
