import { Max, Min } from 'class-validator';

export class NutritionDemand {
  /**
   * <ul>
   * <li>1 - low demand (Schwachzehrer)</li>
   * <li>1.5 - between low and moderate demand</li>
   * <li>2 - moderate demand (Mittelzehrer)</li>
   * <li>2.5 - between moderate and high demand</li>
   * <li>3 - high demand (Starkzehrer)</li>
   * </ul>
   *
   */
  @Min(1)
  @Max(3)
  public value: number;
}
