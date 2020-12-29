import { DomainModule } from '@eg-domain/domain.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotanicalNodeRepositoryProvider } from './botanical-node/adapter/botanical-node-repository.provider';
import { BotanicalNodeRepositoryTypeOrmAdapter } from './botanical-node/adapter/botanical-node-repository.typeorm.adapter';
import { BotanicalNodeTypeOrmRepository } from './botanical-node/repository/botanical-node.typeorm-repository';
import { BotanicalNodeI18nSchema } from './botanical-node/schema/botanical-node-i18n.schema';
import { BotanicalNodeSchema } from './botanical-node/schema/botanical-node.schema';
import { BotanicalSpeciesInfoRepositoryProvider } from './botanical-species/adapter/botanical-species-info-repository.provider';
import { BotanicalSpeciesInfoRepositoryTypeOrmAdapter } from './botanical-species/adapter/botanical-species-info-repository.typeorm.adapter';
import { BotanicalSpeciesInfoTypeOrmRepository } from './botanical-species/repository/botanical-species-info.typeorm-repository';
import { BotanicalSpeciesInfoI18nSchema } from './botanical-species/schema/botanical-species-info-i18n.schema';
import { BotanicalSpeciesInfoSchema } from './botanical-species/schema/botanical-species-info.schema';

@Module({
  imports: [
    DomainModule,
    TypeOrmModule.forFeature([
      BotanicalNodeSchema,
      BotanicalNodeI18nSchema,
      BotanicalNodeTypeOrmRepository,

      BotanicalSpeciesInfoSchema,
      BotanicalSpeciesInfoI18nSchema,
      BotanicalSpeciesInfoTypeOrmRepository,
    ]),
  ],
  providers: [
    BotanicalNodeRepositoryProvider,
    BotanicalNodeRepositoryTypeOrmAdapter,

    BotanicalSpeciesInfoRepositoryProvider,
    BotanicalSpeciesInfoRepositoryTypeOrmAdapter,
  ],
  exports: [
    BotanicalNodeRepositoryProvider,
    BotanicalNodeRepositoryTypeOrmAdapter,

    BotanicalSpeciesInfoRepositoryProvider,
    BotanicalSpeciesInfoRepositoryTypeOrmAdapter,
  ],
})
export class PersistenceModule {}
