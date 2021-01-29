import { EnumUtils } from '@eg-common/util/enum.utils';

import { NamedError } from './named-error';
import { NamedErrorCode } from './named-error-code.enum';

export class NamedErrorBuilder {
  private namedError: NamedError;
  public constructor() {
    this.namedError = new NamedError(undefined, undefined, undefined);
  }

  public errorCodeWithName(namedErrorCode: NamedErrorCode): NamedErrorBuilder {
    this.namedError.errorName = EnumUtils.keyForValue(NamedErrorCode, namedErrorCode) + '';
    this.namedError.errorCode = namedErrorCode;
    return this;
  }

  public errorCode(code: number): NamedErrorBuilder {
    this.namedError.errorCode = code;
    return this;
  }

  public errorName(name: string): NamedErrorBuilder {
    this.namedError.errorName = name;
    return this;
  }
  public errorMsg(msg: (...msgArgs) => string | ((...msgArgs) => string)): NamedErrorBuilder {
    this.namedError.errorMsg = msg;
    return this;
  }

  public build(): NamedError {
    return this.namedError;
  }
}
