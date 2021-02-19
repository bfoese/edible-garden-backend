import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  /**
   * In Heroku environment the database URL can change over time and we need to
   * use the environment variable provided by Heroku to access the database URL.
   * If the first probe does not give a result, we are probably not in Heroku
   * environment and then we fallback to the app configuration.
   *
   * You can find out the Heroku variable names by running 'heroku config' in
   * Heroku CLI.
   */
  url: (): string => process.env.DATABASE_URL ?? process.env.DB_URL,
  schema: (): string => process.env.DB_SCHEMA,

  migrationsRun: (): boolean => process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  synchronize: (): boolean => process.env.TYPEORM_SYNCHRONIZE === 'true',
  sslCA: (): string => process.env.DB_SSL_CA,
  enableLogging: (): boolean => process.env.DB_LOGGING === 'true',
}));
