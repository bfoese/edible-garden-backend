import { EnumUtils } from '@eg-common/util/enum.utils';

import { ErrorCodeWithName } from './error-code-with-name.enum';
import { NamedError } from './named-error.interface';

export class NamedErrorBuilder {
  private namedError: NamedError;
  public constructor() {
    this.namedError = new NamedError(undefined, undefined, undefined);
  }

  public errorCodeWithName(errorCodeWithName: ErrorCodeWithName): NamedErrorBuilder {
    this.namedError.errorName = errorCodeWithName;
    this.namedError.errorCode = EnumUtils.keyForValue(ErrorCodeWithName, errorCodeWithName);
    return this;
  }

  public errorCode(code: string): NamedErrorBuilder {
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
