import { FetchedEmail } from '@eg-app/imap/fetched-email';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthenticationE2EService {
  export const INJECT_TOKEN = 'AuthenticationE2EService';
}

export interface AuthenticationE2EService {
  fetchWorkflowEmails(recipientEmail: string, since: Date | string): Promise<FetchedEmail[]>;
  deleteAccount(usernameOrEmail: string): Promise<boolean>;
  fakeVerifyEmailAddress(usernameOrEmail: string): Promise<void>;
}
