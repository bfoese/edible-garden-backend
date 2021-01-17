import { DomainContantsModule } from '@eg-domain-constants/domain-constants.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DomainContantsModule],
})
export class DomainModule {}
