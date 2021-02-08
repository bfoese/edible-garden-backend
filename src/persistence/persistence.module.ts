import { CryptoModule } from '@eg-app/crypto/crypto.module';
import { DomainModule } from '@eg-domain/domain.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BotanicalNodeRepositoryProvider } from './botanical-node/adapter/botanical-node-repository.provider';
import { BotanicalNodeRepositoryTypeOrmAdapter } from './botanical-node/adapter/botanical-node-repository.typeorm.adapter';
import { BotanicalNodeTypeOrmRepository } from './botanical-node/repository/botanical-node.typeorm-repository';
import { BotanicalNodeI18nSchema } from './botanical-node/schema/botanical-node-i18n.schema';
import { BotanicalNodeSchema } from './botanical-node/schema/botanical-node.schema';
import { GrowingManualRepositoryProvider } from './growing-manual/adapter/growing-manual-repository.provider';
import { GrowingManualRepositoryTypeOrmAdapter } from './growing-manual/adapter/growing-manual-repository.typeorm.adapter';
import { GrowingManualTypeOrmRepository } from './growing-manual/repository/growing-manual.typeorm-repository';
import { GrowingManualI18nSchema } from './growing-manual/schema/growing-manual-i18n.schema';
import { GrowingManualSchema } from './growing-manual/schema/growing-manual.schema';
import { MixedCultureRepositoryProvider } from './mixed-culture/adapter/mixed-culture-repository.provider';
import { MixedCultureRepositoryTypeOrmAdapter } from './mixed-culture/adapter/mixed-culture-repository.typeorm.adapter';
import { MixedCultureTypeOrmRepository } from './mixed-culture/repository/mixed-culture.typeorm-repository';
import { MixedCultureI18nSchema } from './mixed-culture/schema/mixed-culture-i18n.schema';
import { MixedCultureSchema } from './mixed-culture/schema/mixed-culture.schema';
import { SeedSharingOfferRepositoryProvider } from './seed-sharing-offer/adapter/seed-sharing-offer-repository.provider';
import { SeedSharingOfferRepositoryTypeOrmAdapter } from './seed-sharing-offer/adapter/seed-sharing-offer-repository.typeorm.adapter';
import { SeedSharingOfferTypeOrmRepository } from './seed-sharing-offer/repository/seed-sharing-offer.typeorm-repository';
import { SeedSharingOfferSchema } from './seed-sharing-offer/schema/seed-sharing-offer.schema';
import { UserRepositoryProvider } from './user/adapter/user-repository.provider';
import { UserRepositoryTypeOrmAdapter } from './user/adapter/user-repository.typeorm.adapter';
import { UserTypeOrmRepository } from './user/repository/user.typeorm-repository';
import { UserSchema } from './user/schema/user.schema';

@Module({
  imports: [
    DomainModule,
    CryptoModule.register({ secretKey: process.env.BFEG_PERSONAL_DATA_ENCRYPTION_KEY }),
    TypeOrmModule.forFeature([
      BotanicalNodeSchema,
      BotanicalNodeI18nSchema,
      BotanicalNodeTypeOrmRepository,

      GrowingManualSchema,
      GrowingManualI18nSchema,
      GrowingManualTypeOrmRepository,

      MixedCultureSchema,
      MixedCultureI18nSchema,
      MixedCultureTypeOrmRepository,

      UserSchema,
      UserTypeOrmRepository,

      SeedSharingOfferSchema,
      SeedSharingOfferTypeOrmRepository,
    ]),
  ],
  providers: [
    BotanicalNodeRepositoryProvider,
    BotanicalNodeRepositoryTypeOrmAdapter,

    GrowingManualRepositoryProvider,
    GrowingManualRepositoryTypeOrmAdapter,

    MixedCultureRepositoryProvider,
    MixedCultureRepositoryTypeOrmAdapter,

    UserRepositoryProvider,
    UserRepositoryTypeOrmAdapter,

    SeedSharingOfferRepositoryProvider,
    SeedSharingOfferRepositoryTypeOrmAdapter,
  ],
  exports: [
    BotanicalNodeRepositoryProvider,
    BotanicalNodeRepositoryTypeOrmAdapter,

    GrowingManualRepositoryProvider,
    GrowingManualRepositoryTypeOrmAdapter,

    MixedCultureRepositoryProvider,
    MixedCultureRepositoryTypeOrmAdapter,

    UserRepositoryProvider,
    UserRepositoryTypeOrmAdapter,

    SeedSharingOfferRepositoryProvider,
    SeedSharingOfferRepositoryTypeOrmAdapter,
  ],
})
export class PersistenceModule {}
