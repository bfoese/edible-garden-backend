import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  public constructor(userNameOrEmail: string) {
    super(`User '${userNameOrEmail}' not found or provided password invalid`, HttpStatus.NOT_FOUND);
  }
}
