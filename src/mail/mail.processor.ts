import { ApplicationConstants } from '@eg-app/application-constants';
import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { AccountActionEmailJobContext } from './contracts/account-action-email.jobcontext';
import { AccountRegistrationDuplicateAddressJobContext } from './contracts/account-registration-duplicate-address.jobcontext';
import { AccountRegistrationUserDeletedEmailJobContext } from './contracts/account-registration-user-deleted-email.jobcontext';
import { EmailRecipientJobContext } from './contracts/email-recipient.jobcontext';
import { RegisteredEmailId } from './registered-email-id';

@Processor(ApplicationConstants.QueueOutgoingEmail)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  public constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  public onActive(job: Job): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job, result: unknown): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onError(job: Job<any>, error: any): void {
    // TODO re-schedule
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
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
    const subject = `Deine Registrierung`;

    this.sendMail(job, emailId, template, subject);
  }

  @Process(RegisteredEmailId.AccountActionLink)
  public async sendAccountActionLinkMail(job: Job<AccountActionEmailJobContext>): Promise<any> {
    const purpose = job?.data?.purpose;
    if (!purpose) {
      return; // skip if purpose not defined
    }
    const emailId = RegisteredEmailId.AccountActionLink;
    const template = 'account-action-link';

    let subject;

    switch (purpose) {
      case 'VerifyEmailSignup':
        subject = `Willkommen bei Krautland, bitte bestätige deine E-Mail Adresse.`;
        break;
      case 'DeleteAccount':
        subject = `Benutzerkonto löschen`;
        break;
      case 'VerifiyEmailUpdate':
        subject = `Änderung der E-Mail Adresse bestätigen`;
        break;
      case 'ResetPassword':
        subject = `Passwort zurücksetzen`;
        break;
    }
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
        subject: this.getStandardizedEmailSubject(subject),
        context: { ...job.data },
        to: job.data.recipientEmail,
      })
      .catch((error) => {
        this.logger.error(`Failed to send emailId=${emailId} to '${job.data.recipientName}'`, error.stack);
        throw error;
      });
  }

  private getStandardizedEmailSubject(subject: string): string {
    return `[Krautland] ${subject}`;
  }
}
