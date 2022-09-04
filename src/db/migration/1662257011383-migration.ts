import type { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662257011383 implements MigrationInterface {
    name = 'migration1662257011383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "last_assignment_notification" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_assignment_notification"`);
    }

}
