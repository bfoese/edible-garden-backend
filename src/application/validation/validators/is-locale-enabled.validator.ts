import appConfig from '@eg-app/config/app.config';
import { StringUtil } from '@eg-common/util/string.util';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isLocaleEnabled', async: true })
@Injectable()
export class IsLocaleEnabled {
  public constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>
  ) {}

  public async validate(locale: string): Promise<boolean> {
    if (!StringUtil.isEmpty(locale)) {
      const validLocales = this._appConfig.enabledFrontendLocales();
      return validLocales.some((validLocale) => validLocale === locale);
    }
    return true;
  }

  public defaultMessage(args: ValidationArguments): string {
    return `Invalid locale: ${args?.value}`;
  }
}
