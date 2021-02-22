import { ApplicationConstants } from '@eg-app/application-constants';
import appConfig from '@eg-app/config/app.config';
import { EgI18nService } from '@eg-app/i18n/eg-i18n.service';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Job } from 'bull';

import { AccountActionEmailJobContext } from './contracts/account-action-email.jobcontext';
import { AccountRegistrationDuplicateAddressJobContext } from './contracts/account-registration-duplicate-address.jobcontext';
import { AccountRegistrationUserDeletedEmailJobContext } from './contracts/account-registration-user-deleted-email.jobcontext';
import { EmailRecipientJobContext } from './contracts/email-recipient.jobcontext';
import { RegisteredEmailId } from './registered-email-id';

@Processor(ApplicationConstants.QueueOutgoingEmail)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  public constructor(
    private readonly mailerService: MailerService,
    private readonly i18n: EgI18nService,
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>
  ) {}

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
    const template = 'accountSignupUserDeleted';
    const locale = job?.data?.locale;
    const subject = await this.i18n.localize(locale, 'auth.email.subject.AccountSignupUserDeleted', {
      productName: this._appConfig.productName(),
    });
    this.sendMail(job, emailId, template, subject);
  }

  @Process(RegisteredEmailId.AccountRegistrationDuplicateAddress)
  public async sendAccountRegistrationDuplicateAddress(
    job: Job<AccountRegistrationDuplicateAddressJobContext>
  ): Promise<any> {
    const emailId = RegisteredEmailId.AccountRegistrationDuplicateAddress;
    const template = 'accountSignupDuplicateAddress';
    const locale = job?.data?.locale;
    const subject = await this.i18n.localize(locale, 'auth.email.subject.AccountSignupDuplicateAddress');
    this.sendMail(job, emailId, template, subject);
  }

  @Process(RegisteredEmailId.AccountActionLink)
  public async sendAccountActionLinkMail(job: Job<AccountActionEmailJobContext>): Promise<any> {
    const purpose = job?.data?.purpose;
    if (!purpose) {
      return; // skip if purpose not defined
    }
    const emailId = RegisteredEmailId.AccountActionLink;
    const locale = job?.data?.locale;
    const template = 'accountActionLink';
    let subject;

    switch (purpose) {
      case 'VerifyEmailSignup':
        subject = await this.i18n.localize(locale, 'auth.email.subject.VerifyEmailSignup', {
          productName: this._appConfig.productName(),
        });
        break;
      case 'DeleteAccount':
        subject = `Benutzerkonto löschen`;
        break;
      case 'VerifiyEmailUpdate':
        subject = await this.i18n.localize(locale, 'auth.email.subject.VerifiyEmailUpdate');
        break;
      case 'ResetPassword':
        subject = await this.i18n.localize(locale, 'auth.email.subject.ResetPassword');
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

    template = `${template}--${job.data.locale}`;
    return this.mailerService
      .sendMail({
        template: template,
        subject: this.getStandardizedEmailSubject(subject),
        context: { ...job.data },
        to: job.data.recipientEmail,
      } as ISendMailOptions)
      .catch((error) => {
        this.logger.error(
          `Failed to send emailId=${emailId} to '${job.data.recipientName}' template=${template}`,
          error.stack
        );
        throw error;
      });
  }

  private getStandardizedEmailSubject(subject: string): string {
    return `[${this._appConfig.productName()}] ${subject}`;
  }
}
