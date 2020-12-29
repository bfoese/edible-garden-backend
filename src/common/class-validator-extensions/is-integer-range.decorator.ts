import {
  matches,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RangeRegexUtil } from '../regex/range-regex.util';

@ValidatorConstraint()
export class IsIntegerRangeConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public validate(value: any): boolean | Promise<boolean> {
    return typeof value === 'string' && matches(value, RangeRegexUtil.INT_RANGE_PATTERN);
  }
}

/**
 * Checks if the string is an integer range, which are common types in Postgres (int4range,
 * int8range). The pattern allows for positive and negative integers and does
 * not restrict the size of the integer (e.g. 8-Bit, 16-Bit etc.). Positive
 * matches:
 *   <ul>
 *     <li>[-34234,7]</li>
 *     <li>(34234,-7)</li>
 *     <li>[7,-34234)</li>
 *     <li>(-7,34234]</li>
 *   </ul>
 */
export function IsIntegerRange(validationOptions?: ValidationOptions): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsIntegerRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsIntegerRangeConstraint,
    });
  };
}
