import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1611068013103 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "preferred_locale" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "account_action_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "account_action_token"`);
        await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "preferred_locale"`);
    }

}
