import type { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662295440106 implements MigrationInterface {
    name = 'migration1662295440106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_schedule" ADD "last_cron" TIMESTAMP`);
        await queryRunner.query(`CREATE INDEX "IDX_9df6ea514414498e6c7f1af091" ON "user_schedule" ("last_cron") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9df6ea514414498e6c7f1af091"`);
        await queryRunner.query(`ALTER TABLE "user_schedule" DROP COLUMN "last_cron"`);
    }

}
