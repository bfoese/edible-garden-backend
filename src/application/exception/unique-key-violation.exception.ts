import { ApplicationErrorRegistry } from '@eg-app/error/application-error-registry';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueKeyConstraintViolationException extends HttpException {
  public constructor(...msgArgs: string[]) {
    super(ApplicationErrorRegistry.UniqueKeyConstraintViolation.getMessage(...msgArgs), HttpStatus.BAD_REQUEST);
  }
}
