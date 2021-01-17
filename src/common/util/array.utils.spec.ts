import { ArrayUtils } from './array.utils';

describe('ArrayUtils', () => {
  describe('isEmpty', () => {
    it('should return true for null', () => {
      expect(ArrayUtils.isEmpty(<unknown[]>(<unknown>null))).toBe(true);
    });
    it('should return true for an empty array', () => {
      expect(ArrayUtils.isEmpty([])).toBe(true);
    });
    it('should return false for an non-empty array', () => {
      expect(ArrayUtils.isEmpty(['A'])).toBe(false);
    });
    it('should return false for an array containing an empty array', () => {
      expect(ArrayUtils.isEmpty([[]])).toBe(false);
    });
    it('should return false for an array containing an empty object', () => {
      expect(ArrayUtils.isEmpty([{}])).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return false for null', () => {
      expect(ArrayUtils.isNotEmpty(<unknown[]>(<unknown>null))).toBe(false);
    });
    it('should return false for an empty array', () => {
      expect(ArrayUtils.isNotEmpty([])).toBe(false);
    });
    it('should return true for an non-empty array', () => {
      expect(ArrayUtils.isNotEmpty(['A'])).toBe(true);
    });
    it('should return true for an array containing an empty array', () => {
      expect(ArrayUtils.isNotEmpty([[]])).toBe(true);
    });
    it('should return true for an array containing an empty object', () => {
      expect(ArrayUtils.isNotEmpty([{}])).toBe(true);
    });
  });

  describe('contains', () => {
    it('should always return false if the array is undefined/null', () => {
      expect(ArrayUtils.contains(<unknown[]>(<unknown>null), null)).toBe(false);
    });
    it('should always return false if the array is empty and search elem is null', () => {
      expect(ArrayUtils.contains([], null)).toBe(false);
    });
    it('should always return false if the array is empty  and search elem is empty', () => {
      expect(ArrayUtils.contains([], '')).toBe(false);
    });
    it('should match the whole number', () => {
      expect(ArrayUtils.contains([123, 4, 5, 6], 3)).toBe(false);
    });
    it('should return true if number was found', () => {
      expect(ArrayUtils.contains([123, 48, 5, 6], 48)).toBe(true);
    });
    it('should return true for an identical object', () => {
      const a = { foo: 'bar' };
      expect(ArrayUtils.contains([a], a)).toBe(true);
    });
    it('should return false for a diffent object instance with the same content', () => {
      const a = { foo: 'bar' };
      const b = { ...a };
      expect(ArrayUtils.contains([a], b)).toBe(false);
    });
    it('should return true for a string held in differnt variables', () => {
      const a = 'bar';
      const b = 'bar';
      expect(ArrayUtils.contains([a], b)).toBe(true);
    });
    it('should match complex objects', () => {
      const arr = [{ foo: 'bar' }];
      expect(ArrayUtils.contains([arr], arr)).toBe(true);
    });
  });

  describe('pushDistinct', () => {
    it('should handle null gracefully', () => {
      expect(ArrayUtils.pushDistinct(<unknown[]>(<unknown>null), null)).toBeNull();
    });
    it('should handle undefined gracefully', () => {
      expect(ArrayUtils.pushDistinct(<unknown[]>(<unknown>undefined), undefined)).toBeUndefined();
    });
    it('should always return null/undefinded when the source array is null/undefined', () => {
      expect(ArrayUtils.pushDistinct(<unknown[]>(<unknown>null), 'A')).toBeNull();
    });
    it('should not push already contained values', () => {
      const srcArray = ['A', 'B', 1, 2, 'D', 'E'];
      expect(ArrayUtils.pushDistinct(srcArray, 2)).toBe(srcArray);
    });
    it('should push an object with another identity but same content of an already contained one', () => {
      const obj1 = { foo: 'bar' };
      const obj2 = { ...obj1 };

      const srcArray = [obj1, 'B'];
      expect(ArrayUtils.pushDistinct(srcArray, obj2)).toEqual([obj1, 'B', obj2]);
    });
    it('should not push an object which is already contained', () => {
      const obj1 = { foo: 'bar' };
      const srcArray = [obj1, 'B'];
      expect(ArrayUtils.pushDistinct(srcArray, obj1)).toEqual(srcArray);
    });
  });

  describe('filterDistinct', () => {
    it('should handle null gracefully', () => {
      expect(ArrayUtils.filterDistinct(<unknown[]>(<unknown>null))).toBeNull();
    });
    it('should handle undefined gracefully', () => {
      expect(ArrayUtils.filterDistinct(<unknown[]>(<unknown>undefined))).toBeUndefined();
    });
    it('should remove duplicate entries', () => {
      expect(ArrayUtils.filterDistinct(['A', 'B', 'C', 'A', 'B'])).toEqual(['A', 'B', 'C']);
    });

    it('should not remove objects with same content but different identity', () => {
      const obj1 = { foo: 'bar' };
      const obj2 = { ...obj1 };
      const srcArray = [1, obj1, 2, obj2];
      expect(ArrayUtils.filterDistinct(srcArray)).toEqual(srcArray);
    });

    it('should remove objects with same identity', () => {
      const obj1 = { foo: 'bar' };
      const srcArray = [1, obj1, 2, obj1];
      expect(ArrayUtils.filterDistinct(srcArray)).toEqual([1, obj1, 2]);
    });
  });
});
