import emailConfig from '@eg-app-config/email.config';
import redisConfig from '@eg-app-config/redis.config';
import { ApplicationConstants } from '@eg-app/application-constants';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

import handlebarsHelpers = require('handlebars-helpers');

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [emailConfig.KEY],
      useFactory: (_emailConfig: ConfigType<typeof emailConfig>) => ({
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
      }),
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
