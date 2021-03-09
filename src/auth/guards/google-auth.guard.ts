import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard is automatically provisioned by passport-google module to integrate Google OAuth2
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google-auth') {
}
