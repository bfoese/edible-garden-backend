export class UniqueConstraintViolation<T> {
  public constraintName: string;
  public constraintColumns: string[];
  public entity: T;
}
