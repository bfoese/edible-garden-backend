import { MigrationInterface, QueryRunner } from 'typeorm';

export class speciesInfoUpdate1609185415642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" DROP CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" DROP CONSTRAINT "FK_2596c2bc0770cb07f7469e4282e"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node" RENAME COLUMN "parentId" TO "parent_id"`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" DROP CONSTRAINT "UQ_b7ab3671494ff18d7b88f3b53fc"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" DROP COLUMN "botanical_name"`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" DROP CONSTRAINT "REL_2596c2bc0770cb07f7469e4282"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" DROP COLUMN "botanicalSpeciesId"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" ADD "botanical_species_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD CONSTRAINT "UQ_35be1d96465f2800b0855cf1873" UNIQUE ("botanical_species_id")`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" DROP CONSTRAINT "FK_169efe31787e64661e747372cc9"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" DROP CONSTRAINT "FK_853abb23cd1e91684237690258b"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ADD CONSTRAINT "FK_169efe31787e64661e747372cc9" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ADD CONSTRAINT "FK_e47abdf2b9fab6074797de6f0d8" FOREIGN KEY ("parent_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" ADD CONSTRAINT "FK_853abb23cd1e91684237690258b" FOREIGN KEY ("botanical_species_info_id") REFERENCES "public"."eg_botanical_species_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD CONSTRAINT "FK_35be1d96465f2800b0855cf1873" FOREIGN KEY ("botanical_species_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" DROP CONSTRAINT "FK_35be1d96465f2800b0855cf1873"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" DROP CONSTRAINT "FK_853abb23cd1e91684237690258b"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" DROP CONSTRAINT "FK_e47abdf2b9fab6074797de6f0d8"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" DROP CONSTRAINT "FK_169efe31787e64661e747372cc9"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_species_info_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" ADD CONSTRAINT "FK_853abb23cd1e91684237690258b" FOREIGN KEY ("botanical_species_info_id") REFERENCES "public"."eg_botanical_species_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info_i18n" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_species_info_i18n_id_seq')`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_node_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ADD CONSTRAINT "FK_169efe31787e64661e747372cc9" FOREIGN KEY ("botanical_node_id") REFERENCES "public"."eg_botanical_node"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node_i18n" ALTER COLUMN "id" SET DEFAULT nextval('public.eg_botanical_node_i18n_id_seq')`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" DROP CONSTRAINT "UQ_35be1d96465f2800b0855cf1873"`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" DROP COLUMN "botanical_species_id"`);
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_species_info" ADD "botanicalSpeciesId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD CONSTRAINT "REL_2596c2bc0770cb07f7469e4282" UNIQUE ("botanicalSpeciesId")`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD "botanical_name" character varying(200) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD CONSTRAINT "UQ_b7ab3671494ff18d7b88f3b53fc" UNIQUE ("botanical_name")`
    );
    await queryRunner.query(`ALTER TABLE "public"."eg_botanical_node" RENAME COLUMN "parent_id" TO "parentId"`);
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_species_info" ADD CONSTRAINT "FK_2596c2bc0770cb07f7469e4282e" FOREIGN KEY ("botanicalSpeciesId") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."eg_botanical_node" ADD CONSTRAINT "FK_eadf0763d3f746a4074cde9d1c4" FOREIGN KEY ("parentId") REFERENCES "public"."eg_botanical_node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
