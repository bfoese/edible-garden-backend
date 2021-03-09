import { MigrationInterface, QueryRunner } from 'typeorm';

export class googleAuth1615043505991 implements MigrationInterface {
  public name = 'googleAuth1615043505991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."eg_user_ext_auth_provider_enum" AS ENUM('google')`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_user" ADD "ext_auth_provider" "public"."eg_user_ext_auth_provider_enum"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "ext_auth_provider_user_id" character varying`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT "UQ_email"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT "UQ_username"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ALTER COLUMN "username" TYPE character varying`);

    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "password" character varying`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_username" UNIQUE ("username", "ext_auth_provider")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_email" UNIQUE ("email", "ext_auth_provider")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_extUserid" UNIQUE ("ext_auth_provider_user_id", "ext_auth_provider")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT "UQ_extUserid"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT "UQ_email"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT "UQ_username"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "password" character varying(200) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ALTER COLUMN "username" character varying(20)`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_username" UNIQUE ("username")`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_email" UNIQUE ("email")`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "ext_auth_provider_user_id"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "ext_auth_provider"`);
    await queryRunner.query(`DROP TYPE "public"."eg_user_ext_auth_provider_enum"`);
  }
}
