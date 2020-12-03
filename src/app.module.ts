import { Module } from '@nestjs/common';
import { BotanicalFamilyModule } from './botanical-family/botanical-family.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule, DatabaseModule, BotanicalFamilyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
