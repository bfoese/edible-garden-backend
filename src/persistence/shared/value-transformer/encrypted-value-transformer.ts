import { ValueTransformer } from '@bfoese/typeorm';
import { CryptoService } from '@eg-app/crypto/crypto.service';
import { Inject } from '@nestjs/common';

export class EncryptedValueTransformer implements ValueTransformer {
  @Inject()
  private cryptoService: CryptoService;

  public constructor() {
    // TODO This is super ugly right now, but the injected service is not
    // resolved at runtime also: the process.env variable is not resolved at the
    // point of instantiation of this class. CryptoService has an ungly
    // workaround for that.
    this.cryptoService = new CryptoService({ secretKey: process.env.BFEG_PERSONAL_DATA_ENCRYPTION_KEY });
  }

  /**
   * Used to marshal data when writing to the database.
   *
   * Value will be encrypted.
   */
  public to(value: string | null | undefined): string | number | null | undefined {
    if (value === null || value === undefined || typeof value !== 'string') {
      return value;
    }
    try {
      return this.cryptoService.deterministicEncryption(value);
    } catch (error) {
      console.error('[EncryptedValueTransformer] encryption failed: ' + error, error);
    }
    return value;
  }

  /**
   * Used to unmarshal data when reading from the database.
   *
   * Value will be decrypted.
   */
  public from(value: unknown): unknown {
    if (value === null || value === undefined || typeof value !== 'string') {
      return value;
    }
    try {
      const result = this.cryptoService.deterministicDecryption(value);
      return result;
    } catch (error) {
      console.error('[EncryptedValueTransformer] decryption failed: ' + value + error, error);
    }
    return value;
  }
}
