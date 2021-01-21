

import { EmailRecipientJobContext } from './email-recipient.jobcontext';

export interface AccountRegistrationDuplicateAddressJobContext extends EmailRecipientJobContext {
    usernameForSecondRegistration: string;
    showAccountActivationLink: boolean;
    accountActivationUrl?: string;
}
