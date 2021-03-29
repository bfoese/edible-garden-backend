import appConfig from '@eg-app/config/app.config';
import emailConfig from '@eg-app/config/email.config';
import { FetchedEmail } from '@eg-app/imap/fetched-email';
import { ImapSearchOptions } from '@eg-app/imap/imap-search-options';
import { ImapService } from '@eg-app/imap/imap.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Builder } from 'builder-pattern';

@Injectable()
export class AuthenticationE2EService {
  public constructor(
    @Inject(emailConfig.KEY)
    private readonly _emailConfig: ConfigType<typeof emailConfig>,
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private readonly imapService: ImapService
  ) {}

  public fetchWorkflowEmails(recipientEmail: string, since: Date | string): Promise<FetchedEmail[]> {
    if (this._appConfig.isProduction()) {
      // for security reasons not enabled in production
      // TODO find a better way for a more centralized approach to disable services in environments
      return Promise.resolve([]);
    }

    const searchOptions = Builder<ImapSearchOptions>()
      .from(this._emailConfig.outgoingEmailAddress())
      .to(recipientEmail)
      .since(since)
      .build();
    return this.imapService.fetchEmailsFromInbox(searchOptions);
  }
}
