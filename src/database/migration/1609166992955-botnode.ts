import { MigrationInterface, QueryRunner } from 'typeorm';

export class botnode1609170996028 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_node_i18n" ("language_code" character varying(5) NOT NULL, "name" character varying(200) NOT NULL, "botanical_node_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "uq_botanicalNode_languageCode" UNIQUE ("language_code", "botanical_node_id"), CONSTRAINT "PK_f00e82fcfaaf7ac8c4c58bdef95" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_node_taxonomic_rank_enum" AS ENUM('species', 'family')`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_node" ("botanical_name" character varying(200) NOT NULL, "taxonomic_rank" "public"."eg_botanical_node_taxonomic_rank_enum" NOT NULL, "parentId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT 1, CONSTRAINT "UQ_95b1bdcbc479cd8cad0810beee7" UNIQUE ("botanical_name"), CONSTRAINT "PK_eda627916490cacb93125981fbd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" DROP COLUMN "botanical_family"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_species_botanical_family_enum"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "FK_6c5dd65f647f322cf6809bdf232"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "uq_botanicalSpecies_languageCode" UNIQUE ("language_code", "botanical_species_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ADD CONSTRAINT "FK_169efe31787e64661e747372cc9" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ADD CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4" FOREIGN KEY ("parentId") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "FK_6c5dd65f647f322cf6809bdf232" FOREIGN KEY ("botanical_species_id") REFERENCES "public"."eg_botanical_species"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "FK_6c5dd65f647f322cf6809bdf232"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" DROP CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" DROP CONSTRAINT "FK_169efe31787e64661e747372cc9"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "uq_botanicalSpecies_languageCode"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_species_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "FK_6c5dd65f647f322cf6809bdf232" FOREIGN KEY ("botanical_species_id") REFERENCES "public"."eg_botanical_species"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_species_i18n_id_seq')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_species_botanical_family_enum" AS ENUM('unknown', 'valerianaceae', 'apiaceae', 'verbenaceae', 'amaranthaceae', 'fabaceae', 'polygonaceae', 'asteraceae', 'brassicaceae', 'cucurbitaceae', 'alliaceae', 'labiatae', 'aizoaceae', 'solanaceae', 'portulaceae', 'asparagaceae', 'poaceae')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species" ADD "botanical_family" "public"."eg_botanical_species_botanical_family_enum" NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_node"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_node_taxonomic_rank_enum"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_node_i18n"`);
  }
}
