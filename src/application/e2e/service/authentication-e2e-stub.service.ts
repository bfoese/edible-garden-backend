import { FetchedEmail } from '@eg-app/imap/fetched-email';
import { Injectable } from '@nestjs/common';

import { AuthenticationE2EService } from './authentication-e2e.service';

/**
 * This implementation is being used in production environment. The
 * implementation must not change nor leak any data (in case the API might be
 * exposed)! It is supposed to be a stub that does nothing and reveals nothing.
 */
@Injectable()
export class AuthenticationE2EServiceStub implements AuthenticationE2EService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public fetchWorkflowEmails(_recipientEmail: string, _since: Date | string): Promise<FetchedEmail[]> {
    return Promise.resolve([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteAccount(_usernameOrEmail: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
