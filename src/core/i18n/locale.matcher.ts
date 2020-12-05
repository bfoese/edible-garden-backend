import { Locale } from './locale.enum';

export class LocaleMatcher {
  public static isLocaleWhitelistedByEnv = (locale: Locale, envValues: string[]): boolean =>
    envValues &&
    envValues.some(
      (envValue: string) => envValue === '*' || locale.valueOf().toLocaleLowerCase().startsWith(envValue.toLowerCase())
    );
}
