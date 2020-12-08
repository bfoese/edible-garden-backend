import { DomainSnakeCaseNamingStrategy } from './domain-snake-case-naming.strategy';

describe('DomainSnakeCaseNamingStrategy', () => {
  describe('tableName', () => {
    it('should prefix the table names and use snakeCase', async () => {
      expect(new DomainSnakeCaseNamingStrategy().tableName('myFancyTable', null)).toBe('my_fancy_table');
      expect(new DomainSnakeCaseNamingStrategy([]).tableName('myFancyTable', null)).toBe('my_fancy_table');
      expect(new DomainSnakeCaseNamingStrategy(null, true).tableName('myFancyTable', null)).toBe('my_fancy_table');
      expect(new DomainSnakeCaseNamingStrategy(['EG']).tableName('myFancyTable', null)).toBe('EG_my_fancy_table');
    }),
      it('should prefix custom table names as desired', async () => {
        const overrideName = 'CUSTOM-TABLE-NAME';
        expect(new DomainSnakeCaseNamingStrategy(null, true).tableName('myFancyTable', overrideName)).toBe(
          overrideName
        );
        expect(new DomainSnakeCaseNamingStrategy(['eg', 'foo']).tableName('myFancyTable', overrideName)).toBe(
          overrideName
        );
        expect(new DomainSnakeCaseNamingStrategy(['eg', 'Foo'], true).tableName('myFancyTable', overrideName)).toBe(
          `eg_Foo_${overrideName}`
        );
      });
  });
});
