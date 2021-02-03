import { ValueTransformer } from '@bfoese/typeorm';
import { CryptoService } from '@eg-app/crypto/crypto.service';
import { Inject } from '@nestjs/common';

export class EncryptedValueTransformer implements ValueTransformer {

  @Inject()
  private cryptoService: CryptoService

  /**
   * Used to marshal data when writing to the database.
   *
   * Value will be encrypted.
   */
  public to(value: unknown): string | unknown {
    if (value === null || value === undefined) {
      return value;
    }
    try {
      const str = JSON.stringify(value);
      return this.cryptoService.encryptAes(str);
    } catch (error) {
      console.error('[EncryptedValueTransformer] encryption failed: ' + error);
    }
    return value;
  }

  /**
   * Used to unmarshal data when reading from the database.
   *
   * Value will be decrypted.
   */
  public from(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }
    try {
      if (typeof value === 'string') {
        const decrypted = this.cryptoService.decryptAes(value);
        if (!!decrypted) {
          return JSON.parse(decrypted);
        }
      }
    } catch (error) {
      console.error('[EncryptedValueTransformer] decryption failed: ' + error);
    }
    return value;
  }
}
