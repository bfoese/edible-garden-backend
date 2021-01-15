import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueKeyViolationException extends HttpException {
  public constructor() {
    super(`Failed to save object due to unique key violation`, HttpStatus.BAD_REQUEST);
  }
}
