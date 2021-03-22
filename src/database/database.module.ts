import appConfig from '@eg-app-config/app.config';
import dbConfig from '@eg-app-config/db.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TlsOptions } from 'tls';

import { DomainSnakeCaseNamingStrategy } from './strategy/domain-snake-case-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [dbConfig.KEY, appConfig.KEY],
      useFactory: (_dbConfig: ConfigType<typeof dbConfig>, _appConfig: ConfigType<typeof appConfig>) =>
        <TypeOrmModuleOptions>{
          type: 'postgres',

          url: _dbConfig.url(),
          schema: _dbConfig.schema(),
          namingStrategy: new DomainSnakeCaseNamingStrategy(['eg'], false),
          entities: [__dirname + '/../**/schema/*.schema.js'],
          migrations: [__dirname + '/../../**/database/migration/*.js'],
          migrationsTableName: 'migration',
          migrationsRun: _dbConfig.migrationsRun(),
          cli: {
            entitiesDir: '/../../../**/schema/*.schema.js',
            migrationsDir: '/../database/migration-gen',
          },
          synchronize: _dbConfig.synchronize(),
          logging: _dbConfig.enableLogging(),

          // Don't remember where I got the certificate from. Heroku docs do not imply that a certificate file is needed
          // ...(_appConfig.isQA() && {
          //   ssl: <TlsOptions>{ ca: _dbConfig.sslCA(), rejectUnauthorized: false },
          // }),
          ...((_appConfig.isQA() || _appConfig.isProduction()) && {
            ssl: { rejectUnauthorized: false } as TlsOptions,
          }),
        },
    }),
  ],
})
export class DatabaseModule {}
