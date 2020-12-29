import { IsPositive, IsString, IsUUID } from 'class-validator';

/**
 * Base class for the database entities with common properties.
 */
export class EntityInfo {
  @IsString()
  @IsUUID('all')
  private _id: string;
  private _isActive: boolean;
  private _created: Date;
  private _lastChanged: Date;
  private _deleted?: Date;

  @IsPositive()
  private _version: number;

  public set id(id: string) {
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  public set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set created(created: Date) {
    this._created = created;
  }

  public get created(): Date {
    return this._created;
  }

  public set lastChanged(lastChanged: Date) {
    this._lastChanged = lastChanged;
  }

  public get lastChanged(): Date {
    return this._lastChanged;
  }

  public set deleted(deleted: Date) {
    this._deleted = deleted;
  }

  public get deleted(): Date {
    return this._deleted;
  }

  public set version(version: number) {
    this._version = version;
  }

  public get version(): number {
    return this._version;
  }
}
