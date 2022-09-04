import type { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662281051506 implements MigrationInterface {
    name = 'migration1662281051506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_schedule" ("id" SERIAL NOT NULL, "schedule_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_c8c0cb793a4216969055feb69d3" UNIQUE ("user_id", "schedule_id"), CONSTRAINT "PK_1c68f6861388e111e080b7ea766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."schedule_hour_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23')`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "order" integer, "hour" "public"."schedule_hour_enum" NOT NULL, "label" character varying NOT NULL, CONSTRAINT "UQ_efbcdcf0d14f3c66778f2ca3e08" UNIQUE ("hour"), CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_schedule" ADD CONSTRAINT "FK_f521c2a30965fe92253d2876ffb" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_schedule" ADD CONSTRAINT "FK_ed398d25ddca913e979a0fca21f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_schedule" DROP CONSTRAINT "FK_ed398d25ddca913e979a0fca21f"`);
        await queryRunner.query(`ALTER TABLE "user_schedule" DROP CONSTRAINT "FK_f521c2a30965fe92253d2876ffb"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TYPE "public"."schedule_hour_enum"`);
        await queryRunner.query(`DROP TABLE "user_schedule"`);
    }

}
