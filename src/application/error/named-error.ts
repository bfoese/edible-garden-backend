export class NamedError {
  private _errorName: string;
  private _errorCode: number;
  private _errorMsg?: (...msgArgs) => string | ((...msgArgs) => string);

  public constructor(code: number, name: string, message?: (...msgArgs) => string | ((...msgArgs) => string)) {
    this.errorCode = code;
    this.errorName = name;
    this._errorMsg = message;
  }

  public set errorName(name: string) {
    this._errorName = name;
  }

  public get errorName(): string {
    return this._errorName;
  }

  public set errorCode(code: number) {
    this._errorCode = code;
  }

  public get errorCode(): number {
    return this._errorCode;
  }

  public set errorMsg(msg: (...msgArgs) => string | ((...msgArgs) => string)) {
    this._errorMsg = msg;
  }

  public getMessage(...args: string[]): string {
    if (!this._errorMsg) {
      return this.printCode();
    }
    const customMsg = this._errorMsg(args);
    const customMsgAsString = typeof customMsg === 'string' ? customMsg : customMsg();
    return `${this.printCode()} | ${customMsgAsString}`;
  }

  private printCode(): string {
    return `[Error ${this._errorCode}] ${this._errorName}`;
  }
}
