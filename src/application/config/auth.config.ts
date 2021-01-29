import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  authHashingPepper: (): string => process.env.BFEG_AUTH_HASHING_PEPPER,

  jwtSecret: (): string => process.env.BFEG_JWT_SECRET,
  jwtExpirationTime: (): string | number => process.env.BFEG_JWT_EXPIRATION_TIME,

  jwtRefreshSecret: (): string => process.env.BFEG_JWT_REFRESH_SECRET,
  jwtRefreshExpirationTime: (): string | number => process.env.BFEG_JWT_REFRESH_EXPIRATION_TIME,

  jwtAccountActionSecret: (): string => process.env.BFEG_JWT_ACCOUNT_ACTION_SECRET,

  cookieSignatureSecret: (): string => process.env.BFEG_COOKIE_SIGNATURE_SECRET,
}));
