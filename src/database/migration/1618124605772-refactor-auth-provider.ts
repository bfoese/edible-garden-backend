import { MigrationInterface, QueryRunner } from 'typeorm';

export class refactorAuthProvider1618124605772 implements MigrationInterface {
    public name = 'refactorAuthProvider1618124605772';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT "UQ_extUserid"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "ext_auth_provider"`);
        await queryRunner.query(`DROP TYPE "public"."eg_user_ext_auth_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "ext_auth_provider_user_id"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "account_auth_providers" jsonb`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT IF EXISTS "UQ_email"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT IF EXISTS "UQ_username"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_username" UNIQUE ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT IF EXISTS "UQ_email"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP CONSTRAINT IF EXISTS "UQ_username"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_username" UNIQUE ("username", "ext_auth_provider")`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_email" UNIQUE ("email", "ext_auth_provider")`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "account_auth_providers"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "ext_auth_provider_user_id" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."eg_user_ext_auth_provider_enum" AS ENUM('google')`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "ext_auth_provider" "public"."eg_user_ext_auth_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD CONSTRAINT "UQ_extUserid" UNIQUE ("ext_auth_provider", "ext_auth_provider_user_id")`);
    }
}
