import { IS_PUBLIC_KEY } from '@eg-auth/decorators/public-endpoint.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * This guard is automatically provisioned by passport-jwt module. The guard
 * will automatically invoke our custom configured passport-jwt logic,
 * validating the JWT, and assigning the user property to the request object
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(private reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // check if Public() decorator is present, if so, allow without authentication
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
