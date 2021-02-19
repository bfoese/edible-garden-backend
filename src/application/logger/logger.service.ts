import { Injectable, Logger, Scope } from '@nestjs/common';

// Transient providers are not shared across consumers
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  public error(message: string, trace: string): void {
    super.error(message, trace);
  }
}
