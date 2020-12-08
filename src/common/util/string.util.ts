export class StringUtil {
  /**
   * Transforms camelCase to snakeCase without leading underscore.
   * Examples:
   * <ul>
   * <li>'myTestVariable' transforms to 'my_test_variable'</li>
   * <li>'MyTestVariable' transforms to 'my_test_variable'</li>
   * </ul>
   *
   * @param str - String to transform
   */
  public static snakeCase(str: string): string {
    if (str != undefined) {
      // replace uppercase letters with underscore and lowercase letter
      str = str.replace(/[A-Z]/g, (upperCaseLetter) => `_${upperCaseLetter.toLowerCase()}`);
      // remove leading underscore
      str = str.replace(/^_?/g, () => '');
    }
    return str;
  }
}
