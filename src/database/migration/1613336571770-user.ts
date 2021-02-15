import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1613336571770 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "is_email_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "is_email_verified"`);
    }
}
