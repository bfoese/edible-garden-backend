import { SnakeCaseNamingStrategy } from './snake-case-naming.strategy';

describe('SnakeCaseNamingStrategy', () => {
  describe('tableName', () => {
    it('should be transformed to snakeCase', async () => {
      expect(new SnakeCaseNamingStrategy().tableName('myFancyTable', null)).toBe('my_fancy_table');
      expect(new SnakeCaseNamingStrategy().tableName('MyTable', null)).toBe('my_table');
    }),
      it('should respect the override name from the user without any transformation', async () => {
        const overrideName = 'CUSTOM-TABLE-NAME';
        expect(new SnakeCaseNamingStrategy().tableName('myFancyTable', overrideName)).toBe(overrideName);
      });
  });

  describe('columnName', () => {
    it('should be transformed to snakeCase', async () => {
      expect(new SnakeCaseNamingStrategy().columnName('myLongPropertyName', null, [])).toBe('my_long_property_name');
      expect(new SnakeCaseNamingStrategy().columnName('Property', null, [])).toBe('property');
    }),
      it('should respect the override name from the user without any transformation', async () => {
        const overrideName = 'CUSTOM-COLUMN-NAME';
        expect(new SnakeCaseNamingStrategy().columnName('myProperty', overrideName, [])).toBe(overrideName);
      }),
      it('should respect the the given prefixes', async () => {
        const overrideName = 'CUSTOM-COLUMN-NAME';
        expect(new SnakeCaseNamingStrategy().columnName('myProperty', null, ['EG'])).toBe('EG_my_property');
        expect(new SnakeCaseNamingStrategy().columnName('myProperty', null, ['eg', 'foo'])).toBe('eg_foo_my_property');
        expect(new SnakeCaseNamingStrategy().columnName('myProperty', overrideName, ['EG', 'Foo'])).toBe(
          'EG_Foo_' + overrideName
        );
      });
  });

  describe('columnNameCustomized', () => {
    it('should not transform at all', async () => {
      const overrideName = 'CuSToM-NAME';
      expect(new SnakeCaseNamingStrategy().columnNameCustomized(overrideName)).toBe(overrideName);
    });
  });

  describe('relationName', () => {
    it('should be transformed to snakeCase', async () => {
      expect(new SnakeCaseNamingStrategy().relationName('myRelationName')).toBe('my_relation_name');
      expect(new SnakeCaseNamingStrategy().relationName('MyRelation')).toBe('my_relation');
    });
  });
});
