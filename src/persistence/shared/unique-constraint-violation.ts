export class UniqueConstraintViolation<T> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public constructor(public constraintName: string, public constraintColumns: any, public entity: T) {}
}
