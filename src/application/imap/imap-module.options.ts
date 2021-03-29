import { ModuleMetadata, Type } from '@nestjs/common';

export interface ImapModuleOptions {
  host: string;
  port: number;
  tls?: boolean;
  tlsOptions?: any;
  userEmail: string;
  userCredentials: string;

  /**
   * Whether this module should be globally available within the application or
   * not.
   */
  global?: boolean;
}

export interface ImapOptionsFactory {
  createImapOptions(): Promise<ImapModuleOptions> | ImapModuleOptions;
}

export interface ImapModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ImapOptionsFactory>;
  useClass?: Type<ImapOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ImapModuleOptions> | ImapModuleOptions;
  inject?: any[];
}
