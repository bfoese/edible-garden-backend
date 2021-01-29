import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for securing account activation.
 * This guard is automatically provisioned by passport-jwt module. The guard
 * will automatically invoke our custom configured passport-jwt-action logic,
 * validating the JWT, and assigning the user property to the request object
 */
@Injectable()
export class SecureAccountActionGuard extends AuthGuard('secure-account-action') {
  /**
   * Without this override, the guard would simply reject the request when the
   * token is expired. In this case, the implementation from the activation
   * method in the controller is never hit. The user will see an ugly error
   * page that is generated on server side. But in case the token is expired,
   * I want to redirect the user to an URL from the frontend where the error
   * message is being rendered nicely. Therefore an override of this method is
   * needed, even though we do nothing here, except returning the user. It
   * will result in the controller to be called that uses this guard and there
   * we can handle the situation. If we throw a HTTPException from here,
   * again, the controller method using this guard will not be called.
   *
   * @param err - In case of token expiration the value is 'null'
   * @param user - In case of token expiration the value is 'false'
   * @param info - In case of token expiration the following text is contained
   * followed with a stack trace: 'TokenExpiredError: jwt expired'
   * @param _context - big object with lots of information :)
   * @param status - In case of token expiration the value is 'null'
   */
  public handleRequest(_err: any, user: any, _info: any, _context: any, _status?: any): any {
    // just return the user object: the controller will receive user=false
    // in case of token validation errors, otherwise the resolved user will
    // be provided
    return user;
  }
}
