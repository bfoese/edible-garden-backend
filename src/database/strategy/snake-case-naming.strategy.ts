import { StringUtil } from '@eg-common/util/string.util';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

/**
 * Overrides the default TypeORM naming strategy which is camelCase. We use
 * snakeCase instead, because of easier handling of manual queries in Postgres
 */
export class SnakeCaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  /**
   * @param targetName -
   * @param userSpecifiedName - User specified name will be respected and not overridden
   */
  public tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : StringUtil.snakeCase(targetName);
  }

  public columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    const columnName = customName ?? StringUtil.snakeCase(propertyName);
    return embeddedPrefixes.concat(columnName).join('_');
  }

  public columnNameCustomized(customName: string): string {
    return customName;
  }

  public relationName(propertyName: string): string {
    return StringUtil.snakeCase(propertyName);
  }
}
