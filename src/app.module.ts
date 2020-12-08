import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotanicalSpeciesModule } from './botanical-species/botanical-species.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { DomainModule } from './domain/domain.module';
import { LoggerModule } from './logger/logger.module';
import { RestApiModule } from './rest-api/rest-api.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    BotanicalSpeciesModule,
    DomainModule,
    RestApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
