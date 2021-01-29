/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountActivationEmailJobContext } from '@eg-mail/contracts/account-activation-email.jobcontext';

const mockedMailService = {
  sendAccountActivation: (_jobContext: AccountActivationEmailJobContext): Promise<boolean> => Promise.resolve(true),
};

export default mockedMailService;
