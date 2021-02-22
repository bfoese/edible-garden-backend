import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  public constructor(errors: ValidationError[]) {
    super(ValidationException.collectMsg(errors));
  }

  private static collectMsg(errors: ValidationError[]): string {
    if (errors && errors.length > 0) {
      let msg = '';
      for (const error of errors) {
        msg += `${error.property}: ${Object.values(error.constraints).join(', ')};`;
      }
      return msg;
    }
    return undefined;
  }
}
