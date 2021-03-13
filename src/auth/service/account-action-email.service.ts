import appConfig from '@eg-app-config/app.config';
import { AccountActionPurpose } from '@eg-auth/constants/account-action-purpose';
import { AuthRouteConstants } from '@eg-auth/constants/auth-route-constants';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { UserFindOptions } from '@eg-domain/user/user-find-options';
import { HashingService } from '@eg-hashing/hashing.service';
import { AccountActionEmailJobContext } from '@eg-mail/contracts/account-action-email.jobcontext';
import { MailService } from '@eg-mail/mail.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { JwtTokenFactoryService } from './jwt-token-factory.service';

@Injectable()
export class AccountActionEmailService {
  public constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtTokenFactoryService: JwtTokenFactoryService,
    private readonly mailService: MailService
  ) {}

  /**
   * This will send an email to the provided email address with a link to start the action defined by the 'purpose' parameter.
   * Intentionally, this method does NOT return a success status or throws any
   * errors except when no email address was provided. The reason for this is to
   * not provide an open door for potential attackers to sniff out which email
   * adresses are known within the system and which are not.
   * Clients should simply advise the user to check their email account.
   * @param dto -
   */
  public async sendAccountActionEmail(purpose: AccountActionPurpose, email: string): Promise<void> {
    if (!email || !purpose) {
      throw new BadRequestException('Email address and purpose required');
    }
    const user = await this.userService.findByEmail(email, { withHiddenFields: { email: true } } as UserFindOptions);
    if (!user) {
      return; // do NOT throw error in this case
    }

    const accountActionToken: string = this.jwtTokenFactoryService.generateAccountActionToken(user, purpose);
    const accountActivationUrl = this.getAccountActionUrl(purpose, accountActionToken);

    const emailContext: AccountActionEmailJobContext = {
      recipientEmail: user.email,
      recipientName: user.username,
      accountActionUrl: accountActivationUrl,
      purpose: purpose,
      urlExpirationHours: 12, // TODO don't hardcode,
      locale: user.preferredLocale
    };

    // update activation token on user object
    const updateUserData = {
      accountActionToken: accountActionToken,
      entityInfo: { id: user.entityInfo.id },
    } as User;
    this.userService.save(updateUserData);
    this.mailService.sendAccountActionLink(emailContext);
  }

  public getAccountActionUrl(purpose: AccountActionPurpose, actionToken: string): string {
    switch (purpose) {
      case 'VerifyEmail':
      case 'VerifyEmailSignup':
      case 'VerifiyEmailUpdate':
        return this.getVerifyEmailUrl(actionToken);
      case 'ResetPassword':
        return this.getPasswordResetUrl(actionToken);
      case 'DeleteAccount':
        return this.getAccountDeletionUrl(actionToken);
      default:
        return `${purpose}`;
    }
  }

  private getVerifyEmailUrl(accountActionToken: string): string {
    return `${this._appConfig.serverUrl()}/edible-garden/auth/${AuthRouteConstants.Path_VerifyEmail}?${
      AuthRouteConstants.QueryParam_Token
    }=${accountActionToken}`;
  }
  private getPasswordResetUrl(accountActionToken: string): string {
    return `${this._appConfig.serverUrl()}/edible-garden/auth/${AuthRouteConstants.Path_ResetPassword}?${
      AuthRouteConstants.QueryParam_Token
    }=${accountActionToken}`;
  }
  private getAccountDeletionUrl(accountActionToken: string): string {
    return `${this._appConfig.serverUrl()}/edible-garden/auth/${AuthRouteConstants.Path_DeleteAccount}?${
      AuthRouteConstants.QueryParam_Token
    }=${accountActionToken}`;
  }
}
