import { Provider } from '@nestjs/common';
import { BotanicalSpeciesRepositoryTypeOrmAdapter } from './botanical-species-repository.typeorm.adapter';

export const BotanicalSpeciesRepositoryProvider: Provider = {
  provide: 'BotanicalSpeciesRepositoryTypeOrm',
  useClass: BotanicalSpeciesRepositoryTypeOrmAdapter,
};
