import { Test, TestingModule } from '@nestjs/testing';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  const secretKey = '003ca9579092c210de6c20fe4667e5ab';
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

  describe('non-deterministic encryption and decryption', () => {
    it('should create a different output, even for the same input and be able to restore the original text', async () => {
      const cipher1 = await cryptoService.nonDeterministicEncryption(message);
      const cipher2 = await cryptoService.nonDeterministicEncryption(message);
      const cipher3 = await cryptoService.nonDeterministicEncryption(message);

      expect(cipher1 !== cipher2 && cipher2 !== cipher3).toBeTruthy();

      const decypher1 = await cryptoService.nonDeterministicDecryption(cipher1);
      const decypher2 = await cryptoService.nonDeterministicDecryption(cipher2);
      const decypher3 = await cryptoService.nonDeterministicDecryption(cipher3);

      expect(decypher1).toBe(message);
      expect(decypher2).toBe(message);
      expect(decypher3).toBe(message);
    });
  });

  describe('deterministic encryption and decryption', () => {
    it('should create the same output for the same input and be able to restore the original text', async () => {
      const cipher1 = await cryptoService.deterministicEncryption(message);
      const cipher2 = await cryptoService.deterministicEncryption(message);
      const cipher3 = await cryptoService.deterministicEncryption(message);

      expect(cipher1 === cipher2 && cipher2 === cipher3).toBeTruthy();

      expect(await cryptoService.deterministicDecryption(cipher1)).toBe(message);
      expect(await cryptoService.deterministicDecryption(cipher2)).toBe(message);
      expect(await cryptoService.deterministicDecryption(cipher3)).toBe(message);
    });
  });
});
