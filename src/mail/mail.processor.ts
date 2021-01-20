import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

import { AppConstants } from '../application/app.constants';
import { AccountActivationEmailJobData } from './contracts/account-activation-email-job-data.interface';

@Processor(AppConstants.QueueOutgoingEmail)
export class MailProcessor {
  public constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  public onActive(job: Job): void {
    console.log(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job, result: any): void {
    console.log(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any): void {
    console.log(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @Process('accountActivationEmail')
  public async sendAccountActivationMail(job: Job<AccountActivationEmailJobData>): Promise<any> {
    try {
      const result = await this.mailerService.sendMail({
        template: 'account-activation',
        context: {
          activationUrl: job.data.accountActivationUrl,
          recipientName: job.data.recipientName,
        },
        subject: `Willkommen bei Krautland! Bitte aktiviere dein Benutzerkonto.`,
        to: job.data.recipientEmail,
      });
      return result;
    } catch (error) {
      console.error(`Failed to send account activation email to '${job.data.recipientName}'`, error.stack);
      throw error;
    }
  }
}
