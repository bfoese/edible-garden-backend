import { CryptoService } from '@eg-app/crypto/crypto.service';
import { Test, TestingModule } from '@nestjs/testing';

import { EncryptedValueTransformer } from './encrypted-value-transformer';

describe('EncryptedValueTransformer', () => {
  let encryptedValueTransformer: EncryptedValueTransformer;

  const testData = {
    secretKey: '003ca9579092c210de6c20fe4667e5ab',
    message: 'foo@bar.baz',
    // this is the encrypted cipher based on AES with ECB mode for the properties message and secretKey
    aesEcbCipherForKeyMsg: 'l7yWWFgSjsY7bmkVTrMuQg==',
  };

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
      get: jest.fn(() => new CryptoService({ secretKey: testData.secretKey })),
      set: jest.fn(),
    });
  });

  describe('to an from conversion', () => {
    it('should be able to encrypt and decrypt a message using AES', async () => {
      const transformedValue1 = await encryptedValueTransformer.to(testData.message);
      const transformedValue2 = await encryptedValueTransformer.to(testData.message);

      expect(transformedValue1).toBe(testData.aesEcbCipherForKeyMsg);
      expect(transformedValue1 === transformedValue2).toBeTruthy();
      expect(await encryptedValueTransformer.from(transformedValue1)).toBe(testData.message);
    });

    it('should handle null and undefined gracefully', async () => {
      let transformedValue = await encryptedValueTransformer.to(null);
      expect(transformedValue).toBe(null);

      transformedValue = await encryptedValueTransformer.to(undefined);
      expect(transformedValue).toBe(undefined);

      expect(await encryptedValueTransformer.from(null)).toBe(null);
      expect(await encryptedValueTransformer.from(undefined)).toBe(undefined);
    });
  });
});
