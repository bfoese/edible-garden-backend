import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controller/health.controller';
import { HealthTasksService } from './health-tasks.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthTasksService]
})
export class HealthModule {}
