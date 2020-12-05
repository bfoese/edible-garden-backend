import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotanicalFamilyModule } from './botanical-family/botanical-family.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    BotanicalFamilyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
