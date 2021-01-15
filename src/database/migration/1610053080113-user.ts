import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1610053080113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."eg_user" ("email" character varying(320) NOT NULL, "username" character varying(20) NOT NULL, "password" character varying(200) NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "UQ_username" UNIQUE ("username"), CONSTRAINT "UQ_email" UNIQUE ("email"), CONSTRAINT "PK_f42c1ef2faec30bcf101e080282" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."eg_user"`);
  }
}
