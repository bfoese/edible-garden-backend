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
    it('be able to validate the original peppered password', async () => {
      const hash = await hashingService.createSaltedPepperedHash(password);
      const verified = await hashingService.verifyPepperedHash(password, hash);
      expect(verified).toBe(true);
    });

    it('should fail during peppered validation of wrong password', async () => {
      const hash = await hashingService.createSaltedPepperedHash(password);
      const verified = await hashingService.verifyPepperedHash(password.toLowerCase(), hash);
      expect(verified).toBe(false);
    });

    it('be able to validate the original unpeppered password', async () => {
      const hash = await hashingService.createSaltedHash(password);
      const verified = await hashingService.verifyUnpepperedHash(password, hash);
      expect(verified).toBe(true);
    });

    it('should fail during unpeppered validation of wrong password', async () => {
      const hash = await hashingService.createSaltedHash(password);
      const verified = await hashingService.verifyUnpepperedHash(password.toLowerCase(), hash);
      expect(verified).toBe(false);
    });
  });
});
