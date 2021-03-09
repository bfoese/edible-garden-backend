import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNotEmptyIfExtAuthProviderValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public validate(value: any, args: ValidationArguments): boolean | Promise<boolean> {
    const [relatedPropertyName] = args.constraints;
    // related Value is supposed to be the 'extAuthProvider' field
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (relatedValue === undefined || relatedValue === null) {
      return true; // when extAuthProvider is not defined, we have nothing to validate
    }

    // value must be defined and not an empty object
    return value !== undefined && value !== null && Object.keys(value).length !== 0;
  }

  public defaultMessage(args: ValidationArguments): string {
    return `This field must not be empty in combination with an external auth provider: ${args?.value}`;
  }
}

export function IsNotEmptyIfExtAuthProvider(
  extAuthProviderProperty: string,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isNotEmptyIfExtAuthProvider',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [extAuthProviderProperty],
      options: validationOptions,
      validator: IsNotEmptyIfExtAuthProviderValidator,
    });
  };
}
