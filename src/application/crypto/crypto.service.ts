import { Inject, Injectable } from '@nestjs/common';
import { AES, enc, mode } from 'crypto-ts';

import { CryptoModuleOptions } from './crypto-module.options';

@Injectable()
export class CryptoService {
  public constructor(@Inject('CONFIG_OPTIONS') private options: CryptoModuleOptions) {
    if (options?.secretKey) {
      this.validateRequiredAesKeyLength(options.secretKey);
    }
  }

  /**
   * Encrypt a message using AES with a non-deterministic mode, which results in
   * different ciphers for the same input and with  the possibility to decrypt
   * the original message.
   *
   * @see https://stackoverflow.com/a/47096284/11964644
   * @param data - Message to be encrypted
   */
  public nonDeterministicEncryption(data: string): string | undefined | null {
    if (data !== undefined && data !== null) {
      return AES.encrypt(data, this.getSecretKey()).toString();
    }
    return data;
  }

  /**
   * Decrypt a message using AES with non-deterministic mode.
   * @param cipherText - AES encrypted message to be decrypted
   */
  public nonDeterministicDecryption(cipherText: string): string | undefined | null {
    if (cipherText !== undefined && cipherText !== null) {
      const bytes = AES.decrypt(cipherText, this.getSecretKey());
      return bytes.toString(enc.Utf8);
    }
    return cipherText;
  }

  /**
   * Encrypt a message using AES with ECB mode, which results in consistently
   * the same cipher for the same input, like a hash function would do, but with
   * the possibility to decrypt the original message.
   *
   * @see https://stackoverflow.com/a/47096284/11964644
   * @see https://stackoverflow.com/a/61075195/11964644 for the difference of WordArray and String as a key
   * @param data - Message to be encrypted
   */
  public deterministicEncryption(data: string): string | undefined | null {
    if (data !== undefined && data !== null) {
      return AES.encrypt(data, enc.Utf8.parse(this.getSecretKey()), { mode: mode.ECB }).toString();
    }
    return data;
  }

  /**
   * Decrypt a message using AES with ECB mode
   * @param cipherText - AES ECB encrypted message to be decrypted
   */
  public deterministicDecryption(cipherText: string): string | undefined | null {
    if (cipherText !== undefined && cipherText !== null) {
      const bytes = AES.decrypt(cipherText, enc.Utf8.parse(this.getSecretKey()), { mode: mode.ECB });
      return bytes.toString(enc.Utf8);
    }
    return cipherText;
  }

  private getSecretKey(): string {
    // TODO right now there is a fallback on process.env. This is because this
    // service is NOT injected into EncryptedValueTransformer. Get rid of this
    // fallback when you figured out DI
    const key = this.options.secretKey || process.env.BFEG_PERSONAL_DATA_ENCRYPTION_KEY;

    this.validateRequiredAesKeyLength(key);
    return key;
  }

  /**
   * Methods in here use AES encryption. With AES, there are three possible key
   * lengths: 128-bit (16 bytes), 192-bit (24 bytes) or 256-bit (32 bytes).
   *
   * Library like pbkdf2 could be used to create keys of desired length, but
   * decided against it: right now this service is only used to encrypt personal
   * data in the database including the email address. Changing the key would
   * require overhead to migrate the encrypted data to the new key. So changing
   * keys in production is something that would be done rather seldom.
   *
   * <code> var pbkdf2 = require('pbkdf2'); var key_128 =
   * pbkdf2.pbkdf2Sync('password', 'salt', 1, 128 / 8, 'sha512'); </code>
   *
   * @param key - encryption key that is used for AES encryption
   */
  private validateRequiredAesKeyLength(key: string): void {
    if (key) {
      const keyByteSize = Buffer.byteLength(key, 'utf8');
      if (keyByteSize !== 16 && keyByteSize !== 24 && keyByteSize !== 32) {
        throw `[CryptoService] invalid key length: AES requires key size of 128, 192 or 256 bytes. keyLength=${keyByteSize} key=${key}`;
      }
    }
  }
}
