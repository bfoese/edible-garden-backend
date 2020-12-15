import { Locale } from '@eg-core/i18n/locale.enum';
import { LocaleMatcher } from '@eg-core/i18n/locale.matcher';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, () => unknown> => ({
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
  })
);
