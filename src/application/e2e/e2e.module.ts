import emailConfig from '@eg-app/config/email.config';
import { ImapModuleOptions } from '@eg-app/imap/imap-module.options';
import { ImapModule } from '@eg-app/imap/imap.module';
import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { AuthenticationE2EFacadeService } from './presentation/facade/authentication-e2e-facade.service';
import { E2EEmailDtoMapper } from './presentation/facade/mapper/e2e-email-dto.mapper';
import { AuthenticationE2EController } from './presentation/rest-api/authentication-e2e.controller';
import { AuthenticationE2EServiceFactory } from './service/authentication-e2e-service.factory';

@Module({
  imports: [
    DataAccessModule,
    ImapModule.registerAsync({
      imports: [ConfigModule],
      inject: [emailConfig.KEY],
      useFactory: (_emailConfig: ConfigType<typeof emailConfig>) =>
        ({
          userEmail: _emailConfig.outgoingEmailAddress(),
          userCredentials: _emailConfig.imapCredentials(),
          host: _emailConfig.imapHost(),
          port: _emailConfig.imapPort(),
          tls: _emailConfig.imapTls(),
          tlsOptions: _emailConfig.imapTlsOptions(),
        } as ImapModuleOptions),
    }),
  ],
  controllers: [AuthenticationE2EController],
  providers: [AuthenticationE2EFacadeService, E2EEmailDtoMapper, AuthenticationE2EServiceFactory],
})
export class E2EModule {}
