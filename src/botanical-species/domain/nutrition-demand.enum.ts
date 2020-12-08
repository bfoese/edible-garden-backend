/**
 * Plants can be categorized by the amount of nutrients they deprive from the
 * soil.
 */
export enum NutritionDemand {
  unknown = 'unknown',
  /**
   * German: Schwachzehrer
   */
  low = 'low',
  /**
   * German: Mittelzehrer
   */
  moderate = 'moderate',
  /**
   * German: Starkzehrer
   */
  high = 'high',
}
