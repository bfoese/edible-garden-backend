import { IsString, MaxLength, MinLength } from 'class-validator';

export class Address {
  @IsString()
  private _line1: string;
  /**
   * Must be alphanumerical, even within EU, there are countries with alphanumeric system.
   * @see https://de.wikipedia.org/wiki/Liste_der_Postleitsysteme
   */
  private _postalCode: string;
  private _city: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2)
  private _countryCode: string;

  public set line1(line1: string) {
    this._line1 = line1;
  }

  public get line1(): string {
    return this._line1;
  }

  public set postalCode(postalCode: string) {
    this._postalCode = postalCode;
  }

  public get postalCode(): string {
    return this._postalCode;
  }

  public set city(city: string) {
    this._city = city;
  }

  public get city(): string {
    return this._city;
  }

  public set countryCode(countryCode: string) {
    this._countryCode = countryCode;
  }

  public get countryCode(): string {
    return this._countryCode;
  }
}
