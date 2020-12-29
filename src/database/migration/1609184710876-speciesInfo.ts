import { MigrationInterface, QueryRunner } from 'typeorm';

export class speciesInfo1609184710876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_species_info_i18n" ("language_code" character varying(5) NOT NULL, "name" character varying(200) NOT NULL, "botanical_species_info_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "uq_botanicalSpeciesInfo_languageCode" UNIQUE ("language_code", "botanical_species_info_id"), CONSTRAINT "PK_6b6238d2fb904dc1e0427ac6f96" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_species_info_edible_parts_enum" AS ENUM('unknown', 'root', 'bulb', 'stem', 'flower', 'leaf', 'fruit', 'seed', 'sprout')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_species_info_nutrition_demand_enum" AS ENUM('unknown', 'low', 'moderate', 'high')`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_species_info" ("botanical_name" character varying(200) NOT NULL, "edible_parts" "public"."eg_botanical_species_info_edible_parts_enum" array, "nutrition_demand" "public"."eg_botanical_species_info_nutrition_demand_enum", "is_bee_pasture" boolean, "is_green_manure" boolean, "botanicalSpeciesId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "UQ_b7ab3671494ff18d7b88f3b53fc" UNIQUE ("botanical_name"), CONSTRAINT "REL_2596c2bc0770cb07f7469e4282" UNIQUE ("botanicalSpeciesId"), CONSTRAINT "PK_64ba7243247e82cfbebe8564659" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" DROP CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" DROP CONSTRAINT "FK_169efe31787e64661e747372cc9"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ADD CONSTRAINT "FK_169efe31787e64661e747372cc9" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ADD CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4" FOREIGN KEY ("parentId") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" ADD CONSTRAINT "FK_853abb23cd1e91684237690258b" FOREIGN KEY ("botanical_species_info_id") REFERENCES "public"."eg_botanical_species_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD CONSTRAINT "FK_2596c2bc0770cb07f7469e4282e" FOREIGN KEY ("botanicalSpeciesId") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" DROP CONSTRAINT "FK_2596c2bc0770cb07f7469e4282e"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" DROP CONSTRAINT "FK_853abb23cd1e91684237690258b"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" DROP CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" DROP CONSTRAINT "FK_169efe31787e64661e747372cc9"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_node_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ADD CONSTRAINT "FK_169efe31787e64661e747372cc9" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ADD CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4" FOREIGN KEY ("parentId") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_node_i18n_id_seq')`
    );
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_species_info"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_species_info_nutrition_demand_enum"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_species_info_edible_parts_enum"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_species_info_i18n"`);
  }
}
