import emailConfig from '@eg-app-config/email.config';
import redisConfig from '@eg-app-config/redis.config';
import { ApplicationConstants } from '@eg-app/application-constants';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import handlebarsHelpers from 'handlebars-helpers';

import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [emailConfig.KEY],
      useFactory: (_emailConfig: ConfigType<typeof emailConfig>) => ({

        // transport: { host: 'mail.gandi.net', port: 465,
        // secureConnection: true, // use SSL,
        //        auth: { user: '', pass: '' } as SMTPTransport },
        transport: _emailConfig.transportUrl(),
        defaults: {
          from: _emailConfig.from(),
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(handlebarsHelpers(['comparison'])),
          options: {
            strict: true,
          },
        },
      } as MailerOptions),
    }),
    BullModule.registerQueueAsync({
      name: ApplicationConstants.QueueOutgoingEmail,
      imports: [ConfigModule],
      inject: [redisConfig.KEY],
      useFactory: (_redisConfig: ConfigType<typeof redisConfig>) => ({
        redis: _redisConfig.url,
      }),
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
