import { Module } from '@nestjs/common';
import { BotanicalFamilyFacadeModule } from './botanical-family/botanical-family-facade/botanical-family-facade.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule, DatabaseModule, BotanicalFamilyFacadeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
