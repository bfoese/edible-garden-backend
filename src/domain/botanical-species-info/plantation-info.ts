import { IsPositive } from 'class-validator';

export class PlantationInfo {
  /**
   * Distance between plants in cm
   */
  @IsPositive()
  public distanceBetweenPlants?: number;

  /**
   * Distance between rows in cm
   */
  @IsPositive()
  public distanceBetweenRows?: number;

  /**
   * Plants per square meter
   */
  @IsPositive()
  public plantsSqm: number;
}
