import { Inject, Injectable } from '@nestjs/common';
import { assert } from 'console';
import { AES, enc } from 'crypto-ts';

import { CryptoModuleOptions } from './crypto-module.options';

@Injectable()
export class CryptoService {
  public constructor(@Inject('CONFIG_OPTIONS') private options: CryptoModuleOptions) {
    assert(!!this.options.secretKey, 'CryptoService requires secret key to be defined');
  }

  /**
   * Encrypt a message using AES
   * @param data Message to be encrypted
   */
  public encryptAes(data: string): string | undefined | null {
    if (data !== undefined && data !== null) {
      return AES.encrypt(data, this.options.secretKey).toString();
    }
    return data;
  }

  /**
   * Decrypt a message using AES
   * @param cipherText AES encrypted message to be decrypted
   */
  public decryptAes(cipherText: string): string | undefined | null {
    if (cipherText !== undefined && cipherText !== null) {
      const bytes = AES.decrypt(cipherText, this.options.secretKey);
      return bytes.toString(enc.Utf8);
    }
    return cipherText;
  }
}
