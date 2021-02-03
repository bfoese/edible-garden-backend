import { CryptoService } from '@eg-app/crypto/crypto.service';
import { Test, TestingModule } from '@nestjs/testing';

import { EncryptedValueTransformer } from './encrypted-value-transformer';

describe('EncryptedValueTransformer', () => {
  let encryptedValueTransformer: EncryptedValueTransformer;
  const secretKey = 'myFancySecretKey';
  const message = 'please encrypt me to keep me safe';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EncryptedValueTransformer,
          useValue: new EncryptedValueTransformer(),
        },
      ],
    }).compile();

    encryptedValueTransformer = module.get(EncryptedValueTransformer);

    Object.defineProperty(encryptedValueTransformer, 'cryptoService', {
      get: jest.fn(() => new CryptoService({ secretKey: secretKey })),
      set: jest.fn(),
    });
  });

  describe('encrypt and decrypt a message', () => {
    it('should be able to encrypt and decrypt a message using AES', async () => {
      const transformedValue = await encryptedValueTransformer.to(message);
      expect(transformedValue !== message).toBeTruthy();
      const reparsedValue = await encryptedValueTransformer.from(transformedValue);
      expect(reparsedValue).toBe(message);
    });

    it('should be able to encrypt and decrypt a number using AES', async () => {
      const phoneNumber = 4317423456754;

      const transformedValue = await encryptedValueTransformer.to(phoneNumber);
      expect(transformedValue !== phoneNumber).toBeTruthy();
      expect(typeof transformedValue === 'string').toBeTruthy();
      expect(await encryptedValueTransformer.from(transformedValue)).toBe(phoneNumber);
    });

    it('should handle zero gracefully', async () => {
      const transformedValue = await encryptedValueTransformer.to(0);
      expect(transformedValue !== 0 && transformedValue !== '0').toBeTruthy();
      expect(await encryptedValueTransformer.from(transformedValue)).toBe(0);
    });

    it('should handle null gracefully', async () => {
      let transformedValue = await encryptedValueTransformer.to(null);
      expect(transformedValue).toBe(null);

      transformedValue = await encryptedValueTransformer.to(undefined);
      expect(transformedValue).toBe(undefined);

      expect(await encryptedValueTransformer.from(null)).toBe(null);
      expect(await encryptedValueTransformer.from(undefined)).toBe(undefined);
    });
  });
});
