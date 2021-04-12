import emailConfig from '@eg-app/config/email.config';
import { FetchedEmail } from '@eg-app/imap/fetched-email';
import { ImapSearchOptions } from '@eg-app/imap/imap-search-options';
import { ImapService } from '@eg-app/imap/imap.service';
import { UserService } from '@eg-data-access/user/user.service';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Builder } from 'builder-pattern';

import { AuthenticationE2EService } from './authentication-e2e.service';

/**
 * This implementation will be solely injected when being in non-production
 * environment and is therefore operating on a development/qa system. All
 * interface functions are intended to be implemented with working code that
 * fullfills the intended interface contract.
 */
@Injectable()
export class AuthenticationE2EServiceImpl implements AuthenticationE2EService {
  public constructor(
    @Inject(emailConfig.KEY)
    private readonly _emailConfig: ConfigType<typeof emailConfig>,
    private readonly imapService: ImapService,
    private readonly userService: UserService
  ) {}

  public fetchWorkflowEmails(recipientEmail: string, since: Date | string): Promise<FetchedEmail[]> {
    const searchOptions = Builder<ImapSearchOptions>()
      .from(this._emailConfig.outgoingEmailAddress())
      .to(recipientEmail)
      .since(since)
      .build();
    return this.imapService.fetchEmailsFromInbox(searchOptions);
  }

  public async deleteAccount(usernameOrEmail: string): Promise<boolean> {
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new NotFoundException();
    }
    return this.userService.deleteAccountPermanently(user.entityInfo.id);
  }

  public async fakeVerifyEmailAddress(usernameOrEmail: string): Promise<void> {
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new BadRequestException();
    }
    await this.userService.verifyEmail(user.entityInfo.id);
  }
}
