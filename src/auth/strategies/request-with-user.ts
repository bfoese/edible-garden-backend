import { User } from '@eg-domain/user/user';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: Promise<User>;
}
