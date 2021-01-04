import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1609780556671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create extension if not exists "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_node_i18n" ("language_code" character varying(5) NOT NULL, "name" character varying(200) NOT NULL, "botanical_node_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "uq_botanicalNode_languageCode" UNIQUE ("language_code", "botanical_node_id"), CONSTRAINT "PK_f00e82fcfaaf7ac8c4c58bdef95" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_node_taxonomic_rank_enum" AS ENUM('variety', 'subspecies', 'species', 'genus', 'family')`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_node" ("botanical_name" character varying(200) NOT NULL, "taxonomic_rank" "public"."eg_botanical_node_taxonomic_rank_enum" NOT NULL, "parent_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "UQ_95b1bdcbc479cd8cad0810beee7" UNIQUE ("botanical_name"), CONSTRAINT "PK_eda627916490cacb93125981fbd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_growing_manual_i18n" ("language_code" character varying(5) NOT NULL, "name" character varying(200) NOT NULL, "growing_manual_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "uq_growingManual_languageCode" UNIQUE ("language_code", "growing_manual_id"), CONSTRAINT "PK_962d2f338252cfb3a89a754189d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_growing_manual_edible_parts_enum" AS ENUM('unknown', 'root', 'bulb', 'stem', 'flower', 'leaf', 'fruit', 'seed', 'sprout')`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_growing_manual" ("edible_parts" "public"."eg_growing_manual_edible_parts_enum" array, "is_bee_pasture" boolean, "is_green_manure" boolean, "botanical_node_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, "nutrition_demand" double precision NOT NULL, CONSTRAINT "REL_c492c1269e3a26f0d653626c85" UNIQUE ("botanical_node_id"), CONSTRAINT "PK_8caf1a29ea2711d053b5d1446ee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_mixed_culture_i18n" ("language_code" character varying(5) NOT NULL, "description" character varying(2000) NOT NULL, "mixed_culture_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "uq_mixedCulture_languageCode" UNIQUE ("language_code", "mixed_culture_id"), CONSTRAINT "PK_372d44b8c07ceefad2dab3f71ac" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_mixed_culture" ("is_disadvantageous" boolean NOT NULL, "first_companion_id" uuid, "second_companion_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "uq_companion_id_combination" UNIQUE ("first_companion_id", "second_companion_id"), CONSTRAINT "PK_8bee4fbe5df11a0ac04cf1a607d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ADD CONSTRAINT "FK_169efe31787e64661e747372cc9" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ADD CONSTRAINT "FK_e47abdf2b9fab6074797de6f0d8" FOREIGN KEY ("parent_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_growing_manual_i18n" ADD CONSTRAINT "FK_bbf90cbbac325a5203914002e89" FOREIGN KEY ("growing_manual_id") REFERENCES "public"."eg_growing_manual"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_growing_manual" ADD CONSTRAINT "FK_c492c1269e3a26f0d653626c853" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_mixed_culture_i18n" ADD CONSTRAINT "FK_1425671b2adb5ca6634a70959f3" FOREIGN KEY ("mixed_culture_id") REFERENCES "public"."eg_mixed_culture"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_mixed_culture" ADD CONSTRAINT "FK_ca955466dafb410402c3287b298" FOREIGN KEY ("first_companion_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_mixed_culture" ADD CONSTRAINT "FK_10961b35cd76f52ae77c5d226ff" FOREIGN KEY ("second_companion_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."eg_mixed_culture" DROP CONSTRAINT "FK_10961b35cd76f52ae77c5d226ff"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_mixed_culture" DROP CONSTRAINT "FK_ca955466dafb410402c3287b298"`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_mixed_culture_i18n" DROP CONSTRAINT "FK_1425671b2adb5ca6634a70959f3"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_growing_manual" DROP CONSTRAINT "FK_c492c1269e3a26f0d653626c853"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_growing_manual_i18n" DROP CONSTRAINT "FK_bbf90cbbac325a5203914002e89"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" DROP CONSTRAINT "FK_e47abdf2b9fab6074797de6f0d8"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" DROP CONSTRAINT "FK_169efe31787e64661e747372cc9"`
    );
    await queryRunner.query(`DROP TABLE "public"."eg_mixed_culture"`);
    await queryRunner.query(`DROP TABLE "public"."eg_mixed_culture_i18n"`);
    await queryRunner.query(`DROP TABLE "public"."eg_growing_manual"`);
    await queryRunner.query(`DROP TYPE "public"."eg_growing_manual_edible_parts_enum"`);
    await queryRunner.query(`DROP TABLE "public"."eg_growing_manual_i18n"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_node"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_node_taxonomic_rank_enum"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_node_i18n"`);
  }
}
