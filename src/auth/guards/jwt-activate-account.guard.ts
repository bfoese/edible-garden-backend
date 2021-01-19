import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for securing account activation.
 * This guard is automatically provisioned by passport-jwt module. The guard
 * will automatically invoke our custom configured passport-jwt-action logic,
 * validating the JWT, and assigning the user property to the request object
 */
@Injectable()
export class JwtActivateAccountGuard extends AuthGuard('jwt-activate-account') {}
