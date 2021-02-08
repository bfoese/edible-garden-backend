export class UniqueConstraintViolation {
  public constructor(public constraintName: string, public constraintColumns: unknown, public entity: unknown) {}
}
