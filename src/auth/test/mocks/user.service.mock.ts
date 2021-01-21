import { User } from '@eg-domain/user/user';
import { plainToClass } from 'class-transformer';

const mockedUserService = {
  create: (user: User): Promise<User> | never => Promise.resolve(plainToClass(User, { ...user, password: undefined })),
  getPasswordFromUser: (): Promise<string> => undefined,
  findByUsernameOrEmail: (): Promise<User> => undefined,
  findByEmail: (): Promise<User> => undefined,
}

export default mockedUserService;
