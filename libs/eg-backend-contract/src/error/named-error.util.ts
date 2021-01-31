import { NamedErrorCode } from './named-error-code.enum';

export class NamedErrorUtil {
  public static isError(key: keyof typeof NamedErrorCode, serverErrorMessage: string): boolean {
    return serverErrorMessage && typeof serverErrorMessage === 'string'
      ? serverErrorMessage.includes(`${key}`) || serverErrorMessage.includes(`${NamedErrorCode[key]}`)
      : false;
  }
}
