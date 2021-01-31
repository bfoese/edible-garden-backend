import { NamedErrorCode } from '@bfoese/eg-be-contract/dist';

import { NamedErrorBuilder } from './named-error.builder';

describe('NamedErrorBuilder', () => {
  function someStrFunction(...msgArgs: string[]): string {
    return 'hello ' + msgArgs;
  }

  const code = 1001;
  const name = 'myName';
  const msgStr: (...msgArgs: string[]) => string = (...msgArgs: string[]) => 'hello ' + msgArgs;
  const msgFn: (...msgArgs: string[]) => (...msgArgs: string[]) => string = (...msgArgs: string[]) => (): string =>
    someStrFunction(...msgArgs);

  describe('build', () => {
    it('should work for code and name seperately', () => {
      [msgStr, msgFn].forEach((value) => {
        const namedError = new NamedErrorBuilder().errorCode(code).errorName(name).errorMsg(value).build();
        expect(namedError.errorCode).toBe(code);
        expect(namedError.errorName).toBe(name);
        expect(namedError.getMessage('world')).toBe('[Error 1001] myName | hello world');
      });
    });
    it('should work with ErrorCodeWithName enum', () => {
      [msgStr, msgFn].forEach((value) => {
        const namedError = new NamedErrorBuilder()
          .errorCodeWithName(NamedErrorCode.UniqueKeyConstraintViolation)
          .errorMsg(value)
          .build();
        expect(namedError.errorCode).toBe(1000);
        expect(namedError.errorName).toBe('UniqueKeyConstraintViolation');
        expect(namedError.getMessage('world')).toBe('[Error 1000] UniqueKeyConstraintViolation | hello world');
      });
    });
  });
});
