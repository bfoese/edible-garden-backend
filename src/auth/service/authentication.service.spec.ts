import appConfig from '@eg-app-config/app.config';
import { ApplicationErrorRegistry } from '@eg-app/error/application-error-registry';
import mockedAccountActionEmailService from '@eg-auth/test/mocks/account-action-email.service.mock';
import mockedJwtTokenFactoryService from '@eg-auth/test/mocks/jwt-token-factory.service.mock';
import mockedMailService from '@eg-auth/test/mocks/mail.service.mock';
import { UserMockFactory } from '@eg-auth/test/mocks/user-mock.factory';
import { UserService } from '@eg-data-access/user/user.service';
import { User } from '@eg-domain/user/user';
import { HashingService } from '@eg-hashing/hashing.service';
import { MailService } from '@eg-mail/mail.service';
import { RefreshTokenCacheService } from '@eg-refresh-token-cache/refresh-token-cache.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';

import mockedUserService from '../test/mocks/user.service.mock';
import { AccountActionEmailService } from './account-action-email.service';
import { AuthenticationService } from './authentication.service';
import { JwtTokenFactoryService } from './jwt-token-factory.service';

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
        {
          provide: AccountActionEmailService,
          useValue: mockedAccountActionEmailService,
        },
        {
          provide: MailService,
          useValue: mockedMailService,
        },
        {
          provide: appConfig.KEY,
          useValue: {
            serverUrl: (): string => process.env.SERVER_URL,
          },
        },
        {
          provide: JwtTokenFactoryService,
          useValue: mockedJwtTokenFactoryService,
        },
      ],
      exports: [appConfig.KEY],
    }).compile();
    authenticationService = await module.get(AuthenticationService);
    hashingService = await module.get(HashingService);
  });

  describe('when registering a new user', () => {
    it('the password should be hashed for the database and the returned user must not expose plain text or hashed password', async () => {
      const spyPasswordHashing = jest.spyOn(hashingService, 'createSaltedPepperedHash');
      const spyUserServiceCreate = jest.spyOn(mockedUserService, 'create');
      const unregisteredUser = UserMockFactory.createInactive();
      const registeredUser = await authenticationService.register(
        unregisteredUser.username,
        unregisteredUser.email,
        unregisteredUser.password
      );
      expect(spyPasswordHashing).toBeCalledTimes(1);

      const passwordHash: string = await spyPasswordHashing.mock.results[0].value;
      const userBeforeSave: User = await spyUserServiceCreate.mock.calls[0][0];
      expect(userBeforeSave.password).toEqual(passwordHash);
      expect(unregisteredUser.password !== passwordHash).toBeTruthy();
      expect(registeredUser.password === null || registeredUser.password === undefined).toBeTruthy();
    });
  });

  describe('validation of the users login credentials', () => {
    it('should return the user if positively validated against the hashed password', async () => {
      const spyVerifyPassword = jest.spyOn(hashingService, 'verifyPepperedHash');
      const spyUserSvcGetPassword = jest.spyOn(mockedUserService, 'getPasswordFromUser');
      const spyUserSvcFindByUserNameOrMail = jest.spyOn(mockedUserService, 'findByUsernameOrEmail');

      const mockedUser = UserMockFactory.createActive();

      const hashedPassword = await hashingService.createSaltedPepperedHash(mockedUser.password);

      spyUserSvcGetPassword.mockResolvedValue(hashedPassword);
      spyUserSvcFindByUserNameOrMail.mockReturnValue(
        Promise.resolve(plainToClass(User, { ...mockedUser, password: hashedPassword } as User))
      );

      const validatedUser = await authenticationService.validateLoginCredentials(
        mockedUser.username,
        mockedUser.password
      );

      expect(spyVerifyPassword).toBeCalledTimes(1);
      expect(validatedUser).toBeDefined();
    });

    it('should throw exception for invalid password', async () => {
      const spyUserSvcGetPassword = jest.spyOn(mockedUserService, 'getPasswordFromUser');
      const spyUserSvcFindByUserNameOrMail = jest.spyOn(mockedUserService, 'findByUsernameOrEmail');
      const mockedUser = UserMockFactory.createActive();

      const hashedPassword = await hashingService.createSaltedPepperedHash(mockedUser.password);

      spyUserSvcGetPassword.mockResolvedValue(hashedPassword);
      spyUserSvcFindByUserNameOrMail.mockReturnValue(
        Promise.resolve(plainToClass(User, { ...mockedUser, password: hashedPassword } as User))
      );

      let validationError;
      try {
        await authenticationService.validateLoginCredentials(mockedUser.username, 'invalidPassword');
      } catch (error) {
        validationError = error;
      }
      expect(validationError).toBeDefined();
      expect(validationError).toBeInstanceOf(HttpException);
      expect((<HttpException>validationError).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect((<HttpException>validationError).getResponse()).toContain(
        ApplicationErrorRegistry.InvalidUserNameOrPassword.errorName
      );
    });

    it('should throw exception if the users account is not activated yet', async () => {
      const spyUserSvcGetPassword = jest.spyOn(mockedUserService, 'getPasswordFromUser');
      const spyUserSvcFindByUserNameOrMail = jest.spyOn(mockedUserService, 'findByUsernameOrEmail');
      const mockedUser = UserMockFactory.createInactive();

      const hashedPassword = await hashingService.createSaltedPepperedHash(mockedUser.password);

      spyUserSvcGetPassword.mockResolvedValue(hashedPassword);
      spyUserSvcFindByUserNameOrMail.mockReturnValue(
        Promise.resolve(plainToClass(User, { ...mockedUser, password: hashedPassword } as User))
      );

      let validationError;
      try {
        await authenticationService.validateLoginCredentials(mockedUser.username, mockedUser.password);
      } catch (error) {
        validationError = error;
      }
      expect(validationError).toBeDefined();
      expect(validationError).toBeInstanceOf(HttpException);
      expect((<HttpException>validationError).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect((<HttpException>validationError).getResponse()).toContain(
        ApplicationErrorRegistry.ActionDeniedAccountNotActivated.errorName
      );
    });

    it('should throw exception if the users account is marked for deletion (=soft deleted)', async () => {
      const spyUserSvcGetPassword = jest.spyOn(mockedUserService, 'getPasswordFromUser');
      const spyUserSvcFindByUserNameOrMail = jest.spyOn(mockedUserService, 'findByUsernameOrEmail');
      const mockedUser = UserMockFactory.createDeleted();

      const hashedPassword = await hashingService.createSaltedPepperedHash(mockedUser.password);

      spyUserSvcGetPassword.mockResolvedValue(hashedPassword);
      spyUserSvcFindByUserNameOrMail.mockReturnValue(
        Promise.resolve(plainToClass(User, { ...mockedUser, password: hashedPassword } as User))
      );

      let validationError;
      try {
        await authenticationService.validateLoginCredentials(mockedUser.username, mockedUser.password);
      } catch (error) {
        validationError = error;
      }
      expect(validationError).toBeDefined();
      expect(validationError).toBeInstanceOf(HttpException);
      expect((<HttpException>validationError).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect((<HttpException>validationError).getResponse()).toContain(
        ApplicationErrorRegistry.InvalidUserNameOrPassword.errorName
      );
    });
  });
});
