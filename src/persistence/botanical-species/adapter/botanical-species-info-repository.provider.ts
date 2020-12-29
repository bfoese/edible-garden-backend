import { Provider } from '@nestjs/common';
import { BotanicalSpeciesInfoRepositoryTypeOrmAdapter } from './botanical-species-info-repository.typeorm.adapter';

export const BotanicalSpeciesInfoRepositoryProvider: Provider = {
  provide: 'BotanicalSpeciesInfoRepositoryTypeOrm',
  useClass: BotanicalSpeciesInfoRepositoryTypeOrmAdapter,
};
