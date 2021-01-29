import { EnumUtils } from './enum.utils';

describe('EnumUtils', () => {
  enum StringEnum {
    Foo = '_foo',
    Bar = '_bar',
    Baz = '_baz',
  }

  enum NumberEnum {
    Foo = 10,
    Bar = 20,
    Baz = 30,
  }

  describe('getKeys', () => {
    it('should return keys of the StringEnum', () => {
      expect(EnumUtils.getKeys(StringEnum)).toEqual(['Foo', 'Bar', 'Baz']);
    });
    it('should return keys of the NumberEnum without the numeric values', () => {
      expect(EnumUtils.getKeys(NumberEnum)).toEqual(['Foo', 'Bar', 'Baz']);
    });
  });

  describe('getKeyByValue', () => {
    it('should return keys of the StringEnum', () => {
      expect(EnumUtils.keyForValue(StringEnum, '_bar')).toEqual('Bar');
    });
    it('should return keys of the NumberEnum', () => {
      expect(EnumUtils.keyForValue(NumberEnum, 30)).toEqual('Baz');
    });
  });
});
