export class UniqueConstraintViolation {
  public constructor(public constraintName: string, public constraintColumns: any, public entity: any) {}
}
