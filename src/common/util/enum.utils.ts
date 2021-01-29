type GenericEnum<E> = {
  [id: string]: E | string;
  [nu: number]: string;
};

export class EnumUtils {
  public static keyForValue<E>(enumType: GenericEnum<E>, enumValue: number | string): keyof GenericEnum<E> | undefined {
    const keys = Object.keys(enumType).filter((x) => enumType[x] === enumValue);
    return keys.length > 0 ? keys[0] : undefined;
  }

  public static getKeys<E extends GenericEnum<unknown>>(enumClass: E): Array<keyof typeof enumClass> {
    // number check, because Object.keys returns the enum string keys AND the associated number values
    return Object.keys(enumClass).filter((value) => isNaN(Number(value)));
  }

  public static toKeyValueObject<E extends GenericEnum<unknown>>(enumClass: E): Record<string, number | string> {
    let result = {};

    EnumUtils.getKeys(enumClass).forEach((key) => {
      result = { ...{ [key]: enumClass[key] } };
    });
    return result;
  }
}
