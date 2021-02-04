import { DynamicModule, Module } from '@nestjs/common';

import { CryptoModuleOptions } from './crypto-module.options';
import { CryptoService } from './crypto.service';

@Module({})
export class CryptoModule {
  public static register(options: CryptoModuleOptions): DynamicModule {
    return {
      module: CryptoModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        CryptoService,
      ],
      exports: [CryptoService],
      global: options?.global ?? false
    };
  }
}
