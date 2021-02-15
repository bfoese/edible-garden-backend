import emailConfig from '@eg-app-config/email.config';
import { ApplicationConstants } from '@eg-app/application-constants';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Queue } from 'bull';

import { AccountActionEmailJobContext } from './contracts/account-action-email.jobcontext';
import { AccountRegistrationDuplicateAddressJobContext } from './contracts/account-registration-duplicate-address.jobcontext';
import { AccountRegistrationUserDeletedEmailJobContext } from './contracts/account-registration-user-deleted-email.jobcontext';
import { EmailRecipientJobContext } from './contracts/email-recipient.jobcontext';
import { RegisteredEmailId } from './registered-email-id';

@Injectable()
export class MailService {
  public constructor(
    @InjectQueue(ApplicationConstants.QueueOutgoingEmail)
    private mailQueue: Queue,
    @Inject(emailConfig.KEY)
    private readonly _emailConfig: ConfigType<typeof emailConfig>
  ) {}

  public async sendAccountSignupDuplicateAddress(
    jobContext: AccountRegistrationDuplicateAddressJobContext
  ): Promise<boolean> {
    return this.enqueueEmail(RegisteredEmailId.AccountRegistrationDuplicateAddress, jobContext);
  }

  public async sendAccountRegistrationUserDeleted(
    jobContext: AccountRegistrationUserDeletedEmailJobContext
  ): Promise<boolean> {
    return this.enqueueEmail(RegisteredEmailId.AccountRegistrationUserDeleted, jobContext);
  }

  public async sendAccountActionLink(jobContext: AccountActionEmailJobContext): Promise<boolean> {
    return this.enqueueEmail(RegisteredEmailId.AccountActionLink, jobContext);
  }

  private async enqueueEmail<T extends EmailRecipientJobContext>(emailId: string, jobContext: T): Promise<boolean> {
    if (!this._emailConfig.enabled()) {
      return false;
    }

    try {
      await this.mailQueue.add(emailId, jobContext);
      return true;
    } catch (error) {
      console.error(`Error queueing emailId=${emailId} for user ${jobContext?.recipientName}`, error);
      // this.logger.error(`Error queueing confirmation email to user ${user.email}`)
      return false;
    }
  }
}
