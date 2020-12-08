import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesPersistenceModule } from 'src/types-persistence/types-persistence.module';
import { BotanicalFamilyRepositoryProvider } from './botanical-family/adapter/botanical-family-repository.provider';
import { BotanicalFamilyRepositoryTypeOrmAdapter } from './botanical-family/adapter/botanical-family-repository.typeorm.adapter';
import { BotanicalFamilyI18nTypeOrmRepository } from './botanical-family/repository/botanical-family-i18n.typeorm.repository';
import { BotanicalFamilyTypeOrmRepository } from './botanical-family/repository/botanical-family.typeorm.repository';
import { BotanicalFamilyI18nSchema } from './botanical-family/schema/botanical-family-i18n.schema';
import { BotanicalFamilySchema } from './botanical-family/schema/botanical-family.schema';

@Module({
  imports: [
    TypesPersistenceModule,
    TypeOrmModule.forFeature([
      BotanicalFamilySchema,
      BotanicalFamilyI18nSchema,
      BotanicalFamilyTypeOrmRepository,
      BotanicalFamilyI18nTypeOrmRepository,
    ]),
  ],
  exports: [BotanicalFamilyRepositoryProvider, BotanicalFamilyRepositoryTypeOrmAdapter],
  providers: [BotanicalFamilyRepositoryProvider, BotanicalFamilyRepositoryTypeOrmAdapter],
})
export class PersistenceModule {}
