import { Inject, Injectable } from '@nestjs/common';

import { HashingModuleOptions } from './hashing-module.options';

import bcrypt = require('bcrypt');

@Injectable()
export class HashingService {
  public constructor(@Inject('CONFIG_OPTIONS') private options: HashingModuleOptions) {}

  public createSaltedPepperedHash(data: string): Promise<string | undefined> {
    if (data === null || data === undefined || data.length === 0) {
      return Promise.resolve(undefined);
    }

    // 10 salt rounds should be quite safe - more increase crypting time
    return bcrypt.hash(this.pepperHash(data), this.options?.saltRounds ?? 10);
  }

  public verifyHash(plainTextData: string, encryptedData: string): Promise<boolean> {
    return bcrypt.compare(this.pepperHash(plainTextData), encryptedData);
  }

  private pepperHash(data: string): string {
    return data ? `${data}${this.getPepper()}` : undefined;
  }

  /**
   * Combining the password with a secret 'pepper' before hashing, will make it
   * harder to use rainbow tables for hacking
   */
  private getPepper(): string {
    return this.options?.pepper ?? '';
  }
}
