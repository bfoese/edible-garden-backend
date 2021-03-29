import emailConfig from '@eg-app/config/email.config';
import { ImapModuleOptions } from '@eg-app/imap/imap-module.options';
import { ImapModule } from '@eg-app/imap/imap.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { AuthenticationE2EFacadeService } from './presentation/facade/authentication-e2e-facade.service';
import { E2EEmailDtoMapper } from './presentation/facade/mapper/e2e-email-dto.mapper';
import { AuthenticationE2EController } from './presentation/rest-api/authentication-e2e.controller';
import { AuthenticationE2EService } from './service/authentication-e2e.service';

/**
 * TODO Actually, in production I do not want the E2E services to be
 * implemented. E2E tests must run in dev/qa/staging environment only. E2EModule
 * should check which environment is currently active and provide different
 * implementations of the services. In production, the services should be
 * stubbed in a way that they neither leak nor change data. So, two instances of
 * a service would be good and the E2EModule provides one or the other based on
 * NODE_ENV (https://github.com/nestjs/nest/issues/601#issuecomment-486538316) or maybe
 * Typescript Proxy type implementation for the services.
 */
@Module({
  imports: [
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
  providers: [AuthenticationE2EFacadeService, AuthenticationE2EService, E2EEmailDtoMapper],
})
export class E2EModule {}
