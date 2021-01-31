import { NamedErrorUtil } from './named-error.util';

describe('NamedErrorUtil', () => {
  describe('isError', () => {
    it('should find the error code', () => {
      const result = NamedErrorUtil.isError(
        'UniqueKeyConstraintViolation',
        '[Code 1000] UniqueKeyConstraintViolation | custom message'
      );
      expect(result).toBeTruthy();
    });
  });
});
