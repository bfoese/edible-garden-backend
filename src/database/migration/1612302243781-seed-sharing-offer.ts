import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedSharingOffer1612302243781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."eg_seed_sharing_offer_shareable_reproductive_material_enum" AS ENUM('seed', 'tuberBulbRhizome', 'seedling', 'cuttingOffshoot')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_seed_sharing_offer_cultivation_principle_enum" AS ENUM('organic', 'synthetic')`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_seed_sharing_offer" ("shareable_reproductive_material" "public"."eg_seed_sharing_offer_shareable_reproductive_material_enum", "cultivation_principle" "public"."eg_seed_sharing_offer_cultivation_principle_enum", "cultivar_epithet" character varying(200), "description" character varying(1000), "user_id" uuid, "botanical_node_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, "address_line1" character varying, "address_postal_code" character varying, "address_city" character varying, "address_country_code" character varying(2), "phone_phone_no" character varying, "phone_country_code" integer, CONSTRAINT "PK_e758c9b69d6964a43a218a0d0f1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "address_line1" character varying`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "address_postal_code" character varying`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "address_city" character varying`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "address_country_code" character varying(2)`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "phone_phone_no" character varying`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" ADD "phone_country_code" integer`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_seed_sharing_offer" ADD CONSTRAINT "FK_3dd803af515dc5cc704729baf58" FOREIGN KEY ("user_id") REFERENCES "public"."eg_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_seed_sharing_offer" ADD CONSTRAINT "FK_0f5d1d29450b9d8a19b71bf84b2" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_seed_sharing_offer" DROP CONSTRAINT "FK_0f5d1d29450b9d8a19b71bf84b2"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_seed_sharing_offer" DROP CONSTRAINT "FK_3dd803af515dc5cc704729baf58"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "phone_country_code"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "phone_phone_no"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "address_country_code"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "address_city"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "address_postal_code"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_user" DROP COLUMN "address_line1"`);
    await queryRunner.query(`DROP TABLE "public"."eg_seed_sharing_offer"`);
    await queryRunner.query(`DROP TYPE "public"."eg_seed_sharing_offer_cultivation_principle_enum"`);
    await queryRunner.query(`DROP TYPE "public"."eg_seed_sharing_offer_shareable_reproductive_material_enum"`);
  }
}
