export class RangeRegexUtil {
  /**
   * Matches ranges for integers which are common types in Postgres (int4range,
   * int8range). The pattern allows for positive and negative integers and does
   * not restrict the size of the integer (e.g. 8-Bit, 16-Bit etc.). Positive
   * matches:
   *   <ul>
   *     <li>[-34234,7]</li>
   *     <li>(34234,-7)</li>
   *     <li>[7,-34234)</li>
   *     <li>(-7,34234]</li>
   *   </ul>
   *
   * Pattern is defined for full match: any characters/whitespace before/after
   * the range will lead to a negative match.
   */
  // eslint-disable-next-line security/detect-unsafe-regex
  public static readonly INT_RANGE_PATTERN: RegExp = /^([(\[]{1}-?[\d]*[,]{1}-?[\d]*[)\]]{1})?$/;
}
