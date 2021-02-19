import { Locale } from '@eg-core/i18n/locale.enum';
import { LocaleMatcher } from '@eg-core/i18n/locale.matcher';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  importedLocales: (): string[] => {
    const envValue: string = process.env.BFEG_LOCALE_IMPORTED || '';
    const envValues: string[] = envValue.split(',');
    return Object.keys(Locale).filter((locale: Locale) => LocaleMatcher.isLocaleWhitelistedByEnv(locale, envValues));
  },
  exportedLocales: (): string[] => {
    const envValue: string = process.env.BFEG_LOCALE_EXPORTED || '';
    const envValues: string[] = envValue.split(',');
    return Object.keys(Locale).filter((locale: Locale) => LocaleMatcher.isLocaleWhitelistedByEnv(locale, envValues));
  },
  sslEnabled: (): boolean => process.env.BFEG_SSL_ENABLED === 'true',

  isProduction: (): boolean => process.env.NODE_ENV === 'production',
  serverUrl: (): string => process.env.SERVER_URL,
  authFrontendUrl: (): string => process.env.BFEG_AUTH_FRONTEND_URL,
}));
