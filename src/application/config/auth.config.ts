import { StringUtil } from '@eg-common/util/string.util';
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  authHashingPepper: (): string => process.env.BFEG_AUTH_HASHING_PEPPER,

  jwtSecret: (): string => process.env.BFEG_JWT_SECRET,
  jwtExpirationTime: (): string | number => process.env.BFEG_JWT_EXPIRATION_TIME,

  jwtRefreshSecret: (): string => process.env.BFEG_JWT_REFRESH_SECRET,
  jwtRefreshExpirationTime: (): string | number => process.env.BFEG_JWT_REFRESH_EXPIRATION_TIME,

  jwtAccountActionSecret: (): string => process.env.BFEG_JWT_ACCOUNT_ACTION_SECRET,

  cookieSignatureSecret: (): string => process.env.BFEG_COOKIE_SIGNATURE_SECRET,

  authFrontendUrl: (): string => process.env.BFEG_AUTH_FRONTEND_URL,
  frontendFeedbackPathAccountDeleted: (localeValue: string, successValue: boolean): string => {
    return StringUtil.parseMessageFormat(process.env.BFEG_FE_FEEDBACK_PATH_ACCOUNT_DELETED, {
      locale: localeValue,
      success: `${successValue}`,
    });
  },
  frontendFeedbackPathEmailVerified: (localeValue: string, successValue: boolean): string => {
    return StringUtil.parseMessageFormat(process.env.BFEG_FE_FEEDBACK_PATH_EMAIL_VERIFIED, {
      locale: localeValue,
      success: `${successValue}`,
    });
  },
  frontendFeedbackPathInvalidTokenVerifyEmail: (localeValue: string): string => {
    return StringUtil.parseMessageFormat(process.env.BFEG_FE_FEEDBACK_PATH_INVALID_TOKEN_VERIFY_EMAIL, {
      locale: localeValue,
    });
  },

  frontendFeedbackPath3rdPartySignin: (localeValue: string): string => {
    return StringUtil.parseMessageFormat(process.env.BFEG_FE_FEEDBACK_PATH_3RD_PARTY_SIGNIN, {
      locale: localeValue,
    });
  },

  googleAuthClientId: (): string => process.env.BFEG_GOOGLE_AUTH_CLIENT_ID,
  googleAuthClientSecret: (): string => process.env.BFEG_GOOGLE_AUTH_CLIENT_SECRET,
  googleAuthRedirectUri: (): string => process.env.BFEG_GOOGLE_AUTH_REDIRECT_URI,
  googleAuthUri: (): string => process.env.BFEG_GOOGLE_AUTH_URI,
  googleAuthTokenUri: (): string => process.env.BFEG_GOOGLE_AUTH_TOKEN_URI,
}));
