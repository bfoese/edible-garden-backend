import appConfig from '@eg-app-config/app.config';
import { RestApiModule } from '@eg-rest-api/rest-api.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './application/health/health.module';
import { LoggerModule } from './application/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    DomainModule,
    RestApiModule,
    HealthModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
