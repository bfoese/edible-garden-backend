import { IsIntegerRange } from '@eg-common/class-validator-extensions/is-integer-range.decorator';
import { GerminationLightDemand } from '@eg-domain-constants/germination-light-demand.enum';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class SowingInfo {
  /**
   * Sowing depth in cm.
   * Depth of zero means, the seed should lay on the surface without being covered with soil.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  private _sowingDepth: number;

  /**
   * Optimum germination temperature
   * Range, e.g. [10,15] for 10-15 degrees
   * Unit Celsius
   */
  @IsIntegerRange()
  @IsOptional()
  private _germTemperature: string;

  /**
   * Average number of days for germination
   * Range, e.g. [10,15] for 10-15 days
   */
  @IsIntegerRange()
  @IsOptional()
  private _germDays: string;

  /**
   * Light demand during germination
   */
  @IsEnum(GerminationLightDemand)
  @IsOptional()
  private _germLightDemand: GerminationLightDemand;

  public set sowingDepth(sowingDepth: number) {
    this._sowingDepth = sowingDepth;
  }

  public get sowingDepth(): number {
    return this._sowingDepth;
  }

  public set germTemperature(germTemperature: string) {
    this._germTemperature = germTemperature;
  }

  public get germTemperature(): string {
    return this._germTemperature;
  }

  public set germDays(germDays: string) {
    this._germDays = germDays;
  }

  public get germDays(): string {
    return this._germDays;
  }

  public set germLightDemand(germLightDemand: GerminationLightDemand) {
    this._germLightDemand = germLightDemand;
  }

  public get germLightDemand(): GerminationLightDemand {
    return this._germLightDemand;
  }
}
