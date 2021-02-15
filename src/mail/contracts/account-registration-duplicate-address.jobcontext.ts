import { EmailRecipientJobContext } from './email-recipient.jobcontext';

export interface AccountRegistrationDuplicateAddressJobContext extends EmailRecipientJobContext {
  usernameForSecondRegistration: string;
  showVerifyEmailLink: boolean;
  accountActivationUrl?: string;
}
