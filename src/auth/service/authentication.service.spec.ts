import { InvalidCredentialsException } from '@eg-auth/exceptions/invalid-credentials.exception';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { HashingService } from '@eg-hashing/hashing.service';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import mockedUser from '../test/mocks/user.mock';
import mockedUserService from '../test/mocks/user.service.mock';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let hashingService: HashingService;

  const hashingPepper = 'myP3pp3r';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'test', signOptions: { expiresIn: '60s' } } as JwtModuleOptions),
        },
        {
          provide: HashingService,
          useValue: new HashingService({ saltRounds: 10, pepper: hashingPepper }),
        },
        {
          provide: RefreshTokenCacheService,
          useValue: {},
        },
      ],
    }).compile();
    authenticationService = await module.get(AuthenticationService);
    hashingService = await module.get(HashingService);
  });

  describe('when registering a new user', () => {
    it('the password should be hashed for the database and the returned user must not expose plain text or hashed password', async () => {
      const spyPasswordHashing = jest.spyOn(hashingService, 'createSaltedPepperedHash');
      const spyUserServiceCreate = jest.spyOn(mockedUserService, 'create');
      const unregisteredUser = mockedUser;
      const registeredUser = await authenticationService.register(unregisteredUser.username, unregisteredUser.email, unregisteredUser.password);
      expect(spyPasswordHashing).toBeCalledTimes(1);

      const passwordHash: string = await spyPasswordHashing.mock.results[0].value;
      const userBeforeSave: User = await spyUserServiceCreate.mock.calls[0][0];
      expect(userBeforeSave.password).toEqual(passwordHash);
      expect(unregisteredUser.password !== passwordHash).toBeTruthy();
      expect(registeredUser.password === null || registeredUser.password === undefined).toBeTruthy();
    });
  });

  describe('when validating the users credentials', () => {
    it('should return the user if positively validated against the hashed password', async () => {
      const spyVerifyPassword = jest.spyOn(hashingService, 'verifyPepperedHash');
      const spyUserSvcGetPassword = jest.spyOn(mockedUserService, 'getPasswordFromUser');
      const spyUserSvcFindByUserNameOrMail = jest.spyOn(mockedUserService, 'findByUsernameOrEmail');

      const hashedPassword = await hashingService.createSaltedPepperedHash(mockedUser.password);

      spyUserSvcGetPassword.mockResolvedValue(hashedPassword);
      spyUserSvcFindByUserNameOrMail.mockReturnValue(
        Promise.resolve({ ...mockedUser, password: hashedPassword } as User)
      );

      const validatedUser = await authenticationService.validateUser(mockedUser.username, mockedUser.password);

      expect(spyVerifyPassword).toBeCalledTimes(1);
      expect(validatedUser).toBeDefined();
    });

    it('should throw exception for invalid password', async () => {
      const spyUserSvcGetPassword = jest.spyOn(mockedUserService, 'getPasswordFromUser');
      const spyUserSvcFindByUserNameOrMail = jest.spyOn(mockedUserService, 'findByUsernameOrEmail');

      const hashedPassword = await hashingService.createSaltedPepperedHash(mockedUser.password);

      spyUserSvcGetPassword.mockResolvedValue(hashedPassword);
      spyUserSvcFindByUserNameOrMail.mockReturnValue(
        Promise.resolve({ ...mockedUser, password: hashedPassword } as User)
      );

      let validationError;
      try {
        await authenticationService.validateUser(mockedUser.username, 'invalidPassword');
      } catch (error) {
        validationError = error;
      }
      expect(validationError).toBeDefined();
      expect(validationError).toBeInstanceOf(InvalidCredentialsException);
    });
  });
});
