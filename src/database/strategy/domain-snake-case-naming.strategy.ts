import { SnakeCaseNamingStrategy } from './snake-case-naming.strategy';

/**
 * Our domain naming rules for tables and columns are:
 * <ul>
 *     <li>domain table names must be prefixed with 'eg_'</li>
 *     <li>table and column names must be snake case (e.g. my_table_name)</li>
 * </ul>
 */
export class DomainSnakeCaseNamingStrategy extends SnakeCaseNamingStrategy {
  /**
   * This strategy extends the {@link SnakeCaseNamingStrategy} by prefixing
   * table names with custom prefixes.
   * This strategy still respects custom table names and will not prefix these.
   *
   * @param tablePrefixes - optional list of prefixes to be concatenated in
   * front of the table names.
   * @param prefixUserSpecifiedNames - Whether custom table names should be respected and not prefixed at all
   */
  public constructor(private tablePrefixes?: string[], private prefixUserSpecifiedNames: boolean = false) {
    super();
  }

  /**
   * @param targetName -
   * @param userSpecifiedName - User specified name will be respected and not overridden
   */
  public tableName(targetName: string, userSpecifiedName: string): string {
    const parentStrategyTableName = super.tableName(targetName, userSpecifiedName);
    if (userSpecifiedName != undefined && !this.prefixUserSpecifiedNames) {
      return parentStrategyTableName;
    }
    return this.applyTableNamePrefix(parentStrategyTableName);
  }

  private applyTableNamePrefix(tableName: string): string {
    return this.tablePrefixes?.length > 0 ? this.tablePrefixes.concat(tableName).join('_') : tableName;
  }
}
