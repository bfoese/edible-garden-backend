/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountActivationEmailJobData } from '@eg-mail/contracts/account-activation-email-job-data.interface';

const mockedMailService = {
  sendAccountActivationEmail: (_jobData: AccountActivationEmailJobData): Promise<boolean> => Promise.resolve(true),
};

export default mockedMailService;
