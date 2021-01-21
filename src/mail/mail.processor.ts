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
import { AccountActivationEmailJobContext } from './contracts/account-activation-email.jobcontext';
import { AccountRegistrationDuplicateAddressJobContext } from './contracts/account-registration-duplicate-address.jobcontext';
import { AccountRegistrationUserDeletedEmailJobContext } from './contracts/account-registration-user-deleted-email.jobcontext';
import { EmailRecipientJobContext } from './contracts/email-recipient.jobcontext';
import { RegisteredEmailId } from './registered-email-id';

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

  @Process(RegisteredEmailId.AccountRegistrationUserDeleted)
  public async sendAccountRegistrationUserDeleted(
    job: Job<AccountRegistrationUserDeletedEmailJobContext>
  ): Promise<any> {
    const emailId = RegisteredEmailId.AccountRegistrationUserDeleted;
    const template = 'account-registration-user-deleted';
    const subject = `Deine Registrierung bei Krautland`;

    this.sendMail(job, emailId, template, subject);
  }

  @Process(RegisteredEmailId.AccountRegistrationDuplicateAddress)
  public async sendAccountRegistrationDuplicateAddress(
    job: Job<AccountRegistrationDuplicateAddressJobContext>
  ): Promise<any> {
    const emailId = RegisteredEmailId.AccountRegistrationDuplicateAddress;
    const template = 'account-registration-duplicate-address';
    const subject = `Deine Registrierung bei Krautland`;

    this.sendMail(job, emailId, template, subject);
  }

  @Process(RegisteredEmailId.AccountActivation)
  public async sendAccountActivationMail(job: Job<AccountActivationEmailJobContext>): Promise<any> {
    const emailId = RegisteredEmailId.AccountActivation;
    const template = 'account-activation';
    const subject = `Willkommen bei Krautland! Bitte aktiviere dein Benutzerkonto.`;

    this.sendMail(job, emailId, template, subject);
  }

  private async sendMail(
    job: Job<EmailRecipientJobContext>,
    emailId: string,
    template: string,
    subject: string
  ): Promise<any> {
    return this.mailerService
      .sendMail({
        template: template,
        subject: subject,
        context: { ...job.data },
        to: job.data.recipientEmail,
      })
      .catch((error) => {
        console.error(`Failed to send emailId=${emailId} to '${job.data.recipientName}'`, error.stack);
        throw error;
      });
  }
}
