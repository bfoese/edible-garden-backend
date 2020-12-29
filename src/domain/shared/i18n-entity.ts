import { IsLocale, IsNotEmpty, IsNotEmptyObject } from 'class-validator';

/**
 * Base class for the i18n data entities with common properties.
 */
export abstract class I18nEntity<Parent> {
  @IsNotEmptyObject()
  private _parent: Parent;

  @IsLocale()
  @IsNotEmpty()
  private _languageCode: string;

  public set parent(parent: Parent) {
    this._parent = parent;
  }

  public get parent(): Parent {
    return this._parent;
  }

  public set languageCode(languageCode: string) {
    this._languageCode = languageCode;
  }

  public get languageCode(): string {
    return this._languageCode;
  }
}
