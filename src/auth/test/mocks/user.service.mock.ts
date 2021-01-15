import { User } from '@eg-domain/user/user';

const mockedUserService = {
  create: (user: User): Promise<User> | never => Promise.resolve({ ...user, password: undefined }),
  getPasswordFromUser: (): Promise<string> => undefined,
  findByUsernameOrEmail: (): Promise<User> => undefined,
};

export default mockedUserService;
