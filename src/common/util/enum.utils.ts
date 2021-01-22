export class EnumUtils {
  public static keyForValue(enumType: unknown, enumValue: number | string): string {
    const keys = Object.keys(enumType).filter((x) => enumType[x] === enumValue);
    return keys.length > 0 ? keys[0] : '';
  }
}
