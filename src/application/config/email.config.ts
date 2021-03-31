import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  transportUrl: (): string => `smtps://${process.env.BFEG_APP_EMAIL_ACCOUNT_ADDRESS}:${process.env.BFEG_APP_EMAIL_ACCOUNT_CREDENTIALS}@${process.env.BFEG_APP_EMAIL_ACCOUNT_SMTP_HOST}`,
  enabled: (): boolean => process.env.BFEG_EMAIL_ENABLED === 'true',
  from: (): string => `Krautland <${process.env.BFEG_APP_EMAIL_ACCOUNT_ADDRESS}>`,

  /**
   * @returns The email address that is used to send the app emails from (= sender email address)
   */
  outgoingEmailAddress: (): string => process.env.BFEG_APP_EMAIL_ACCOUNT_ADDRESS,

  // IMAP access is only needed for E2E tests. For security reasons, the variables are not filled for production
  imapCredentials: (): string =>
    process.env.NODE_ENV === 'production' ? undefined : process.env.BFEG_APP_EMAIL_ACCOUNT_CREDENTIALS,
  imapHost: (): string => (process.env.NODE_ENV === 'production' ? undefined : 'imap.gmail.com'),
  imapPort: (): number => (process.env.NODE_ENV === 'production' ? undefined : 993),
  imapTls: (): boolean => (process.env.NODE_ENV === 'production' ? undefined : true),
  imapTlsOptions: (): any => {
    return process.env.NODE_ENV === 'production' ? undefined : { rejectUnauthorized: false };
  },
}));
