import { ValidationModule } from '@eg-app/validation/validation.module';
import { DomainContantsModule } from '@eg-domain-constants/domain-constants.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ValidationModule, DomainContantsModule],
})
export class DomainModule {}
