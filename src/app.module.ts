import appConfig from '@eg-app-config/app.config';
import { RestApiModule } from '@eg-rest-api/rest-api.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './application/logger/logger.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
