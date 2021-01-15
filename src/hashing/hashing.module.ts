import { DynamicModule, Module } from '@nestjs/common';

import { HashingModuleOptions } from './hashing-module.options';
import { HashingService } from './hashing.service';

@Module({})
export class HashingModule {
  public static register(options: HashingModuleOptions): DynamicModule {
    return {
      module: HashingModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        HashingService,
      ],
      exports: [HashingService],
    };
  }
}
