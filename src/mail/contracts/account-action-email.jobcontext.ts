import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';

import { EmailRecipientJobContext } from './email-recipient.jobcontext';

export interface AccountActionEmailJobContext extends EmailRecipientJobContext {
  accountActionUrl: string;
  purpose: AccountActionPurpose;
  urlExpirationHours: number;
}
