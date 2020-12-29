import { MigrationInterface, QueryRunner } from 'typeorm';

export class embeddables1608637304446 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" DROP CONSTRAINT "uq_botanicalfamily_locale"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "uq_botanicalspecies_locale"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_family_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" DROP CONSTRAINT "FK_425dc0e47b4d9423e555ca3d61b"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_family" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" DROP CONSTRAINT "FK_6c5dd65f647f322cf6809bdf232"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species" ALTER COLUMN "id" DROP DEFAULT`);
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
      `ALTER TABLE "public"."eg_botanical_species" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_species_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "FK_6c5dd65f647f322cf6809bdf232" FOREIGN KEY ("botanical_species_id") REFERENCES "public"."eg_botanical_species"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_species_i18n_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_family_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ADD CONSTRAINT "FK_425dc0e47b4d9423e555ca3d61b" FOREIGN KEY ("botanical_family_id") REFERENCES "public"."eg_botanical_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_family_i18n_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_i18n" ADD CONSTRAINT "uq_botanicalspecies_locale" UNIQUE ("language_code", "botanical_species_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_family_i18n" ADD CONSTRAINT "uq_botanicalfamily_locale" UNIQUE ("language_code", "botanical_family_id")`
    );
  }
}
