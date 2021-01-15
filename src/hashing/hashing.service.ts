import { Inject, Injectable } from '@nestjs/common';

import { HashingModuleOptions } from './hashing-module.options';

import bcrypt = require('bcrypt');

@Injectable()
export class HashingService {
  public constructor(@Inject('CONFIG_OPTIONS') private options: HashingModuleOptions) {}

  public createSaltedPepperedHash(password: string): Promise<string | undefined> {
    if (password === null || password === undefined || password.length === 0) {
      return Promise.resolve(undefined);
    }

    // 10 salt rounds should be quite safe - more increase crypting time
    return bcrypt.hash(this.pepperHash(password), this.options?.saltRounds ?? 10);
  }

  public verifyHash(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(this.pepperHash(plainTextPassword), hashedPassword);
  }

  private pepperHash(password: string): string {
    return password ? `${password}${this.getPepper()}` : undefined;
  }

  /**
   * Combining the password with a secret 'pepper' before hashing, will make it
   * harder to use rainbow tables for hacking
   */
  private getPepper(): string {
    return this.options?.pepper ?? '';
  }
}
