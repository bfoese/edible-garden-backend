import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  ImapModuleAsyncOptions,
  ImapModuleOptions,
  ImapOptionsFactory,
} from './imap-module.options';
import { IMAP_MODULE_OPTIONS } from './imap.constants';
import { ImapService } from './imap.service';

/**
 * A module to fetch emails from an IMAP email account.
 */
@Module({})
export class ImapModule {
  public static register(options: ImapModuleOptions): DynamicModule {
    return {
      module: ImapModule,
      providers: [
        {
          provide: IMAP_MODULE_OPTIONS,
          useValue: options,
        },
        ImapService,
      ],
      exports: [ImapService],
      global: options?.global ?? false,
    };
  }

  public static registerAsync(options: ImapModuleAsyncOptions): DynamicModule {
    return {
      module: ImapModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
      exports: [ImapService],
    };
  }

  private static createAsyncProviders(options: ImapModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [ImapService, this.createAsyncOptionsProvider(options)];
    }
    return [
      ImapService,
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: ImapModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: IMAP_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: IMAP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ImapOptionsFactory): Promise<ImapModuleOptions> => await optionsFactory.createImapOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
