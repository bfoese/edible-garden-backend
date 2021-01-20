import emailConfig from '@eg-app-config/email.config';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Queue } from 'bull';

import { AppConstants } from '../application/app.constants';
import { AccountActivationEmailJobData } from './contracts/account-activation-email-job-data.interface';

@Injectable()
export class MailService {
  public constructor(
    @InjectQueue(AppConstants.QueueOutgoingEmail)
    private mailQueue: Queue,
    @Inject(emailConfig.KEY)
    private readonly _emailConfig: ConfigType<typeof emailConfig>
  ) {}

  public async sendAccountActivationEmail(jobData: AccountActivationEmailJobData): Promise<boolean> {
    if (!this._emailConfig.enabled()) {
      return false;
    }

    try {
      await this.mailQueue.add('accountActivationEmail', jobData);
      return true;
    } catch (error) {
      console.error(`Error queueing confirmation email to user ${jobData?.recipientName}`, error);
      // this.logger.error(`Error queueing confirmation email to user ${user.email}`)
      return false;
    }
  }
}
