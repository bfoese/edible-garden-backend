import { Injectable, Logger } from '@nestjs/common';
import {
  I18nRequestScopeService,
  I18nService,
  translateOptions,
} from 'nestjs-i18n';

@Injectable()
export class EgI18nService {
  private readonly logger = new Logger(EgI18nService.name);

  public constructor(private i18nService: I18nService, private readonly i18nRequestScope: I18nRequestScopeService) {}

  /**
   * This should only used when executed within the scope of a request because
   * only then the locale context is given.
   * @param key
   * @param opts
   */
  public localizeInRequestScope(key: string, opts?: translateOptions) {
    try {
      return this.i18nRequestScope.translate(key, opts);
    } catch (error) {
      this.logger.error(`Failed to localize in request scope: locale=${key}`, error);
    }
    return Promise.resolve(key);
  }

  /**
   * This can be safely called from anywhere, as the locale is being manually
   * provided. From inside of a request scope the locale can be accessed with:
   * <code>@I18nLang() lang: string</code>
   *
   * @param locale
   * @param key
   * @param args
   */
  public localize(locale: string, key: string, args?: object): Promise<string> {
    try {
      return this.i18nService.translate(key, {
        lang: locale,
        args: args,
      } as translateOptions);
    } catch (error) {
      this.logger.error(`Failed to localize: locale=${locale} key=${key}`, error);
    }
    return Promise.resolve(key);
  }
}
