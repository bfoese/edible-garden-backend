import { Test, TestingModule } from '@nestjs/testing';

import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let hashingService: HashingService;
  const hashingPepper = 'myP3pp3r';
  const password = 'FooBar123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HashingService,
          useValue: new HashingService({ saltRounds: 10, pepper: hashingPepper }),
        },
      ],
    }).compile();

    hashingService = module.get(HashingService);
  });

  describe('hash and validate password', () => {
    it('be able to validate the original password', async () => {
      const hash = await hashingService.createSaltedPepperedHash(password);
      const verified = await hashingService.verifyHash(password, hash);
      expect(verified).toBe(true);
    });

    it('should fail during validation of wrong password', async () => {
      const hash = await hashingService.createSaltedPepperedHash(password);
      const verified = await hashingService.verifyHash(password.toLowerCase(), hash);
      expect(verified).toBe(false);
    });
  });
});
