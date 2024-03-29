export class ObjectMockFactory {
  public static create<T>(type: new () => T): T {
    return new type();
  }

  public static of<T>(type: new () => T, params: Partial<T>): T {
    const instance = ObjectMockFactory.create(type);

    Object.assign(instance, params);

    return instance;
  }
}
