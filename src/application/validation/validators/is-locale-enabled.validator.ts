import appConfig from '@eg-app/config/app.config';
import { StringUtil } from '@eg-common/util/string.util';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsLocaleEnabledValidator implements ValidatorConstraintInterface {
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

export function IsLocaleEnabled(validationOptions?: ValidationOptions): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isLocaleEnabled',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsLocaleEnabledValidator,
    });
  };
}
