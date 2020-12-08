import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { DomainSnakeCaseNamingStrategy } from './strategy/domain-snake-case-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      inject: [],
      useFactory: () => ({
        type: 'postgres',

        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        namingStrategy: new DomainSnakeCaseNamingStrategy(['eg'], false),
        entities: [__dirname + '/../**/entity/*.entity{.ts,.js}', __dirname + '/../**/schema/*.schema{.ts,.js}'],
        migrations: [__dirname + '/../**/database/migration/*{.ts,.js}'],
        migrationsTableName: 'migration',
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === process.env.TYPEORM_MIGRATIONS_RUN,
        cli: {
          entitiesDir: '/../**/entity/*.entity.js',
          migrationsDir: '/../**/database/migration-gen',
        },
        synchronize: process.env.TYPEORM_SYNCHRONIZE === process.env.TYPEORM_SYNCHRONIZE,
      }),
    }),
  ],
})
export class DatabaseModule {}
