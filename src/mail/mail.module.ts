import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.BFEG_OUTGOING_MAIL_TRANSPORT_URL,
      defaults: {
        from: '"Edible Garden" <britt.foese@gmail.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      }),
    }),
    BullModule.registerQueueAsync({
      name: 'TestMailQueue',
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379
        },
      }),
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [
    MailService,
  ],
})
export class MailModule {}
