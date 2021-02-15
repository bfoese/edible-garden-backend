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

  describe('contains', () => {
    it('should work case-sensitive', async () => {
      expect(StringUtil.contains('foo Bar baz', 'Bar', false)).toBe(true);
    }),
      it('should work case-insensitive', async () => {
        expect(StringUtil.contains('foo Bar baz', 'BAR', true)).toBe(true);
      }),
      it('should handle empty gracefully', async () => {
        expect(StringUtil.contains('', '', true)).toBe(false);
        expect(StringUtil.contains('', 'Bar', true)).toBe(false);
      }),
      it('should handle null gracefully', async () => {
        expect(StringUtil.contains(null, null, true)).toBe(false);
      });
  });

  describe('parseMessageFormat', () => {
    it('should handle emtpy string gracefully', async () => {
      expect(StringUtil.parseMessageFormat(null, { ordinal: '2nd', name: 'Artem' })).toBe(null);
      expect(StringUtil.parseMessageFormat(undefined, { ordinal: '2nd', name: 'Artem' })).toBe(undefined);
      expect(StringUtil.parseMessageFormat('', { ordinal: '2nd', name: 'Artem' })).toBe('');
    }),
      it('should work with string placeholders', async () => {
        expect(
          StringUtil.parseMessageFormat(
            'Hello {name}, how was your {ordinal} day of freedom? See you tomorrow, {name}.',
            { ordinal: '2nd', name: 'Artem' }
          )
        ).toBe('Hello Artem, how was your 2nd day of freedom? See you tomorrow, Artem.');
      }),
      it('should work with number placeholders', async () => {
        expect(
          StringUtil.parseMessageFormat('Cats have {0} legs, dogs have {0} legs, humans have {1} legs.', {
            0: '4',
            1: '2',
          })
        ).toBe('Cats have 4 legs, dogs have 4 legs, humans have 2 legs.');
      });
  });
});
