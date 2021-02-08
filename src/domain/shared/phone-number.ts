import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class PhoneNumber {
  @IsString()
  private _phoneNo: string;

  /**
   * Without leading zeros.
   *
   * @example '49' for Germany
   *
   * @see https://de.wikipedia.org/wiki/L%C3%A4ndervorwahlliste_sortiert_nach_Nummern
   */
  @IsNumber()
  @MinLength(2)
  @MaxLength(4)
  private _countryCode: number;

  public set phoneNo(phoneNo: string) {
    this._phoneNo = phoneNo;
  }

  public get phoneNo(): string {
    return this._phoneNo;
  }

  public set countryCode(countryCode: number) {
    this._countryCode = countryCode;
  }

  public get countryCode(): number {
    return this._countryCode;
  }

  public toString(): string {
    if (this.phoneNo === undefined) {
      return undefined;
    }

    const countryCode = this.countryCode != undefined ? `+${this.countryCode}` : '';
    return `${countryCode} ${this.phoneNo}`;
  }
}
