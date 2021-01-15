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
import { UserRepositoryProvider } from './user/adapter/user-repository.provider';
import { UserRepositoryTypeOrmAdapter } from './user/adapter/user-repository.typeorm.adapter';
import { UserTypeOrmRepository } from './user/repository/user.typeorm-repository';
import { UserSchema } from './user/schema/user.schema';

@Module({
  imports: [
    DomainModule,
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
  ],
})
export class PersistenceModule {}
