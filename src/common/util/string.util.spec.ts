import { StringUtil } from './string.util';

describe('StringUtil', () => {
  describe('snakeCase', () => {
    it('should transform camelCase to snakeCase without leading underscore', async () => {
      expect(StringUtil.snakeCase('myFooTest')).toBe('my_foo_test');
      expect(StringUtil.snakeCase('myFoo')).toBe('my_foo');
      expect(StringUtil.snakeCase('MyFooTest')).toEqual(expect.not.stringMatching('_my_foo_test'));
      expect(StringUtil.snakeCase('MyFoo')).toBe('my_foo');
      expect(StringUtil.snakeCase('M')).toBe('m');
      expect(StringUtil.snakeCase(null)).toEqual(null);
      expect(StringUtil.snakeCase('')).toEqual('');
    });
  });
});
