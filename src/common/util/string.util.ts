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

  public static isEmpty(str: string): boolean {
    return str === null || str === undefined || str === '';
  }

  public static range(
    lowerBound: number | string | undefined,
    upperBound: number | string | undefined,
    lowerBoundIncluding: boolean,
    upperBoundIncluding: boolean
  ): string {
    const lowerStr: string = `${lowerBound ?? ''}`.trim();
    const upperStr = `${upperBound ?? ''}`.trim();

    if (StringUtil.isEmpty(lowerStr) && StringUtil.isEmpty(upperStr)) {
      return undefined;
    }
    return `${lowerBoundIncluding ? '[' : '('}${lowerStr},${upperStr}${upperBoundIncluding ? ']' : ')'}`;
  }

  public static contains(a: string, searchString: string, ignoreCase: boolean): boolean {
    if (this.isEmpty(a) || this.isEmpty(searchString)) {
      return false;
    }

    const aNormalized = ignoreCase ? a.toLowerCase() : a;
    const substringNormalized = ignoreCase ? searchString.toLowerCase() : searchString;

    return aNormalized.indexOf(substringNormalized) != -1;
  }
}
