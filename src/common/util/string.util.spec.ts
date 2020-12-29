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

  describe('range', () => {
    it('should handle numbers', async () => {
      expect(StringUtil.range(4, 5, true, true)).toBe('[4,5]');
      expect(StringUtil.range(45, 55, false, false)).toBe('(45,55)');
      expect(StringUtil.range(-45, -55, true, false)).toBe('[-45,-55)');
      expect(StringUtil.range(-45, -55, false, true)).toBe('(-45,-55]');
      expect(StringUtil.range(null, 5, true, true)).toBe('[,5]');
      expect(StringUtil.range(4, undefined, true, false)).toBe('[4,)');
      expect(StringUtil.range(undefined, undefined, true, false)).toBe(undefined);
      expect(StringUtil.range(undefined, null, true, false)).toBe(undefined);
    }),
      it('should handle strings', async () => {
        expect(StringUtil.range('4', '5', true, true)).toBe('[4,5]');
        expect(StringUtil.range('45', '55', false, false)).toBe('(45,55)');
        expect(StringUtil.range('-45', '-55', true, false)).toBe('[-45,-55)');
        expect(StringUtil.range('-45', '-55', false, true)).toBe('(-45,-55]');
        expect(StringUtil.range(null, '5', true, true)).toBe('[,5]');
        expect(StringUtil.range('4', undefined, true, false)).toBe('[4,)');
        expect(StringUtil.range('4', '', true, false)).toBe('[4,)');
        expect(StringUtil.range('', null, true, false)).toBe(undefined);
      });
  });
});
