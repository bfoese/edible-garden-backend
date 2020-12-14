import { DomainModule } from '@eg-domain/domain.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotanicalFamilyRepositoryProvider } from './botanical-family/adapter/botanical-family-repository.provider';
import { BotanicalFamilyRepositoryTypeOrmAdapter } from './botanical-family/adapter/botanical-family-repository.typeorm.adapter';
import { BotanicalFamilyTypeOrmRepository } from './botanical-family/repository/botanical-family.typeorm-repository';
import { BotanicalFamilyI18nSchema } from './botanical-family/schema/botanical-family-i18n.schema';
import { BotanicalFamilySchema } from './botanical-family/schema/botanical-family.schema';
import { BotanicalSpeciesRepositoryProvider } from './botanical-species/adapter/botanical-species-repository.provider';
import { BotanicalSpeciesRepositoryTypeOrmAdapter } from './botanical-species/adapter/botanical-species-repository.typeorm.adapter';
import { BotanicalSpeciesTypeOrmRepository } from './botanical-species/repository/botanical-species.typeorm-repository';
import { BotanicalSpeciesI18nSchema } from './botanical-species/schema/botanical-species-i18n.schema';
import { BotanicalSpeciesSchema } from './botanical-species/schema/botanical-species.schema';

@Module({
  imports: [
    DomainModule,
    TypeOrmModule.forFeature([
      BotanicalFamilySchema,
      BotanicalFamilyI18nSchema,
      BotanicalFamilyTypeOrmRepository,

      BotanicalSpeciesSchema,
      BotanicalSpeciesI18nSchema,
      BotanicalSpeciesTypeOrmRepository,
    ]),
  ],
  providers: [
    BotanicalFamilyRepositoryProvider,
    BotanicalFamilyRepositoryTypeOrmAdapter,
    BotanicalSpeciesRepositoryProvider,
    BotanicalSpeciesRepositoryTypeOrmAdapter,
  ],
  exports: [
    BotanicalFamilyRepositoryProvider,
    BotanicalFamilyRepositoryTypeOrmAdapter,
    BotanicalSpeciesRepositoryProvider,
    BotanicalSpeciesRepositoryTypeOrmAdapter,
  ],
})
export class PersistenceModule {}
