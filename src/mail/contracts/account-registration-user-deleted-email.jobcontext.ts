import { EmailRecipientJobContext } from './email-recipient.jobcontext';

export interface AccountRegistrationUserDeletedEmailJobContext extends EmailRecipientJobContext {
  usernameForSecondRegistration: string;
}
