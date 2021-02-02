import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: (): string => process.env.DB_URL,
  schema: (): string => process.env.DB_SCHEMA,

  migrationsRun: (): boolean => process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  synchronize: (): boolean => process.env.TYPEORM_SYNCHRONIZE === 'true',
  sslCA: (): string => process.env.DB_SSL_CA,
}));
