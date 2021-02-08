import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1612385694257 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ALTER COLUMN "email" TYPE VARCHAR`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ALTER COLUMN "email" TYPE VARCHAR(320)`);
  }
}
