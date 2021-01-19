import { User } from '@eg-domain/user/user';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
    public constructor(
        @InjectQueue('TestMailQueue')
        private mailQueue: Queue,
      ) {}

      /** Send email confirmation link to new user account. */
  public async sendConfirmationEmail(user: User, code: string): Promise<boolean> {
    try {
      await this.mailQueue.add('confirmation', {
        user,
        code,
      })
      return true
    } catch (error) {
        console.error(`Error queueing confirmation email to user ${user.email}`, error);
      // this.logger.error(`Error queueing confirmation email to user ${user.email}`)
      return false
    }
  }
}
