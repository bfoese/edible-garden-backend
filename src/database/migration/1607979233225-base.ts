import { MigrationInterface, QueryRunner } from 'typeorm';

export class base1607979233225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_family_i18n" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "language_code" character varying(5) NOT NULL, "name" character varying(200) NOT NULL, "botanicalFamilyId" uuid, CONSTRAINT "uq_botanicalfamily_locale" UNIQUE ("language_code", "botanicalFamilyId"), CONSTRAINT "uq_botanicalfamily_locale" UNIQUE ("language_code", "botanicalFamilyId"), CONSTRAINT "PK_8adb7d79959ec88331bf8e07281" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_family" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "botanical_name" character varying(200) NOT NULL, CONSTRAINT "UQ_6480136433f656bfc7825896c4a" UNIQUE ("botanical_name"), CONSTRAINT "UQ_6480136433f656bfc7825896c4a" UNIQUE ("botanical_name"), CONSTRAINT "PK_e8f0901bc85ad1ec861597b38ca" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_species_i18n" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "language_code" character varying(5) NOT NULL, "name" character varying(200) NOT NULL, "botanicalSpeciesId" uuid, CONSTRAINT "uq_botanicalspecies_locale" UNIQUE ("language_code", "botanicalSpeciesId"), CONSTRAINT "uq_botanicalspecies_locale" UNIQUE ("language_code", "botanicalSpeciesId"), CONSTRAINT "PK_7a38348fc27f7c3c68f4fed79c7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_species_botanical_family_enum" AS ENUM('unknown', 'valerianaceae', 'apiaceae', 'verbenaceae', 'amaranthaceae', 'fabaceae', 'polygonaceae', 'asteraceae', 'brassicaceae', 'cucurbitaceae', 'alliaceae', 'labiatae', 'aizoaceae', 'solanaceae', 'portulaceae', 'asparagaceae', 'poaceae')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_species_edible_parts_enum" AS ENUM('unknown', 'root', 'bulb', 'stem', 'flower', 'leaf', 'fruit', 'seed', 'sprout')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eg_botanical_species_nutrition_demand_enum" AS ENUM('unknown', 'low', 'moderate', 'high')`
    );
    await queryRunner.query(
      `CREATE TABLE "public"."eg_botanical_species" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "botanical_name" character varying(200) NOT NULL, "botanical_family" "public"."eg_botanical_species_botanical_family_enum" NOT NULL, "edible_parts" "public"."eg_botanical_species_edible_parts_enum" array, "nutrition_demand" "public"."eg_botanical_species_nutrition_demand_enum", CONSTRAINT "UQ_6baf86e4a064afb11dc1ea61451" UNIQUE ("botanical_name"), CONSTRAINT "UQ_6baf86e4a064afb11dc1ea61451" UNIQUE ("botanical_name"), CONSTRAINT "PK_9f351842b7655a06db4f12cad24" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ADD CONSTRAINT "FK_ad32277e53cfb997abd67ef8a1b" FOREIGN KEY ("botanicalFamilyId") REFERENCES "public"."eg_botanical_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "FK_538489d45a69e79cf51026d23a8" FOREIGN KEY ("botanicalSpeciesId") REFERENCES "public"."eg_botanical_species"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "FK_538489d45a69e79cf51026d23a8"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" DROP CONSTRAINT "FK_ad32277e53cfb997abd67ef8a1b"`
    );
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_species"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_species_nutrition_demand_enum"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_species_edible_parts_enum"`);
    await queryRunner.query(`DROP TYPE "public"."eg_botanical_species_botanical_family_enum"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_species_i18n"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_family"`);
    await queryRunner.query(`DROP TABLE "public"."eg_botanical_family_i18n"`);
  }
}
