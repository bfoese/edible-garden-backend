import { EmailRecipientJobContext } from './email-recipient.jobcontext';

export interface AccountActivationEmailJobContext extends EmailRecipientJobContext {
  accountActivationUrl: string;
}
