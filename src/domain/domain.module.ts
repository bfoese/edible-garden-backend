import { Module } from '@nestjs/common';
import { DomainContantsModule } from 'src/domain-constants/domain-constants.module';

@Module({
  imports: [DomainContantsModule],
})
export class DomainModule {}
