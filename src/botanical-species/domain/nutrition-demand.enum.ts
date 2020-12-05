/**
 * Plants can be categorized by the amount of nutrients they deprive from the
 * soil.
 */
export enum NutritionDemand {
  /**
   * Fallback value
   */
  unknown = 0,
  /**
   * German: Schwachzehrer
   */
  low = 1,
  /**
   * German: Mittelzehrer
   */
  moderate = 2,
  /**
   * German: Starkzehrer
   */
  high = 2,
}
