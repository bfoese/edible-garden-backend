import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  () => ({
    host: (): string => process.env.DB_HOST,
    port: (): number => Number.parseInt(process.env.DB_PORT),
    username: (): string => process.env.DB_USERNAME,

    password: (): string => process.env.DB_PASSWORD,
    database: (): string => process.env.DB_NAME,
    schema: (): string => process.env.DB_SCHEMA,

    migrationsRun: (): boolean => process.env.TYPEORM_MIGRATIONS_RUN === 'true',
    synchronize: (): boolean => process.env.TYPEORM_SYNCHRONIZE === 'true',
    sslCA: (): string => process.env.DB_SSL_CA,
  }),
);
