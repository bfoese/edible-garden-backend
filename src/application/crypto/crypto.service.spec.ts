import { Test, TestingModule } from '@nestjs/testing';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  const secretKey = 'myFancySecretKey';
  const message = 'please encrypt me to keep me safe';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CryptoService,
          useValue: new CryptoService({ secretKey: secretKey }),
        },
      ],
    }).compile();

    cryptoService = module.get(CryptoService);
  });

  describe('encrypt and decrypt a message', () => {
    it('should be able to encrypt and decrypt a message using AES', async () => {
      const cipher = await cryptoService.encryptAes(message);
      expect(cipher === message).toBeFalsy();
      const decrypted = await cryptoService.decryptAes(cipher);
      expect(decrypted).toBe(message);
    });
  });
});
