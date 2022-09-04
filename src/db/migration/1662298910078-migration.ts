import type { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662298910078 implements MigrationInterface {
    name = 'migration1662298910078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_assignment_notification"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_assignment_notification" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_assignment_request"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_assignment_request" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9df6ea514414498e6c7f1af091"`);
        await queryRunner.query(`ALTER TABLE "user_schedule" DROP COLUMN "last_cron"`);
        await queryRunner.query(`ALTER TABLE "user_schedule" ADD "last_cron" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_9df6ea514414498e6c7f1af091" ON "user_schedule" ("last_cron") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9df6ea514414498e6c7f1af091"`);
        await queryRunner.query(`ALTER TABLE "user_schedule" DROP COLUMN "last_cron"`);
        await queryRunner.query(`ALTER TABLE "user_schedule" ADD "last_cron" TIMESTAMP`);
        await queryRunner.query(`CREATE INDEX "IDX_9df6ea514414498e6c7f1af091" ON "user_schedule" ("last_cron") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_assignment_request"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_assignment_request" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_assignment_notification"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_assignment_notification" TIMESTAMP`);
    }

}
