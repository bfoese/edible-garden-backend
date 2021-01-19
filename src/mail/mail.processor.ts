import { User } from '@eg-domain/user/user';
import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { plainToClass } from 'class-transformer';

@Processor('TestMailQueue')
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

  @Process('confirmation')
  public async sendWelcomeEmail(job: Job<{ user: User; code: string; }>): Promise<any> {
    console.log(`Sending confirmation email to '${job.data.user.email}'`);

    // const url = `${config.get('server.origin')}/auth/${job.data.code}/confirm`
    const url = 'fakeactivationURL';
    // if (!process.env.MAIL_LIVE) {
    //   return 'SENT MOCK CONFIRMATION EMAIL'
    // }

    try {
      const result = await this.mailerService.sendMail({
        template: 'confirmation',
        context: {
          firstName: plainToClass(User, job.data.user).username,
          url: url,
          token: job.data.code
        },
        subject: `Welcome to Edible Garden! Please Confirm Your Email Address`,
        to: job.data.user.email,
      });
      return result;
    } catch (error) {
      console.error(`Failed to send confirmation email to '${job.data.user.email}'`, error.stack);
      throw error;
    }
  }
}
