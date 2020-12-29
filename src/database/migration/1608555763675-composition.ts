import { MigrationInterface, QueryRunner } from 'typeorm';

export class composition1608555763675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" DROP CONSTRAINT "FK_ad32277e53cfb997abd67ef8a1b"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "FK_538489d45a69e79cf51026d23a8"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" RENAME COLUMN "botanicalFamilyId" TO "botanical_family_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" RENAME CONSTRAINT "uq_botanicalfamily_locale" TO "UQ_e86c9108475c40a6d6e69d68449"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" RENAME COLUMN "botanicalSpeciesId" TO "botanical_species_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" RENAME CONSTRAINT "uq_botanicalspecies_locale" TO "UQ_3b450d4a4ae18b332f90ac3c456"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" ADD "is_bee_pasture" boolean`);
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" ADD "is_green_manure" boolean`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ADD CONSTRAINT "uq_botanicalfamily_locale" UNIQUE ("language_code", "botanical_family_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "uq_botanicalspecies_locale" UNIQUE ("language_code", "botanical_species_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ADD CONSTRAINT "FK_425dc0e47b4d9423e555ca3d61b" FOREIGN KEY ("botanical_family_id") REFERENCES "public"."eg_botanical_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
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
      `ALTER TABLE "public"."eg_botanical_family_i18n" DROP CONSTRAINT "FK_425dc0e47b4d9423e555ca3d61b"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "uq_botanicalspecies_locale"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" DROP CONSTRAINT "uq_botanicalfamily_locale"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" DROP COLUMN "is_green_manure"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" DROP COLUMN "is_bee_pasture"`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" RENAME CONSTRAINT "UQ_3b450d4a4ae18b332f90ac3c456" TO "uq_botanicalspecies_locale"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" RENAME COLUMN "botanical_species_id" TO "botanicalSpeciesId"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" RENAME CONSTRAINT "UQ_e86c9108475c40a6d6e69d68449" TO "uq_botanicalfamily_locale"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" RENAME COLUMN "botanical_family_id" TO "botanicalFamilyId"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "FK_538489d45a69e79cf51026d23a8" FOREIGN KEY ("botanicalSpeciesId") REFERENCES "public"."eg_botanical_species"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ADD CONSTRAINT "FK_ad32277e53cfb997abd67ef8a1b" FOREIGN KEY ("botanicalFamilyId") REFERENCES "public"."eg_botanical_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
