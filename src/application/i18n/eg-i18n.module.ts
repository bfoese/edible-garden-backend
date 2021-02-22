import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

import { EgI18nUserLocaleResolver } from './eg-i18n-user-locale.resolver';
import { EgI18nService } from './eg-i18n.service';

@Global()
@Module({})
export class EgI18nModule {

  /**
   * This module uses global annotation and should only imported once.
   */
  public static forRoot(): DynamicModule {
    return {
      module: EgI18nModule,
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => ({
            fallbackLanguage: 'en',
            fallbacks: {
              'en-*': 'en',
              'de-*': 'de',
            },
            parserOptions: {
              path: path.join(__dirname, '/assets/'),
              // watching changes in i18n files
              watch: process.env.NODE_ENV === 'development',
            },
          }),
          parser: I18nJsonParser,
          // different built-in resolvers available (cookie, header, query param, accept language), see docs
          resolvers: [
            { use: EgI18nUserLocaleResolver, options: {} },
            new HeaderResolver(['x-eg-lang']), // we ignore this when the request context has a user with a preferred locale
            { use: QueryResolver, options: ['lang', 'locale'] },
            AcceptLanguageResolver,
          ],
          inject: [],
        }),
      ],
      providers: [EgI18nService, EgI18nUserLocaleResolver],
      exports: [EgI18nService],
      global: true,
    };
  }
}
