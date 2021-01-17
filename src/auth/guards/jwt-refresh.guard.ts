import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard is automatically provisioned by passport-jwt module. The guard
 * will automatically invoke our custom configured passport-jwt-refresh logic,
 * validating the JWT, and assigning the user property to the request object
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
