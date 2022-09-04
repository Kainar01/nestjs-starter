import type { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662258521619 implements MigrationInterface {
    name = 'migration1662258521619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "last_assignment_request" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_assignment_request"`);
    }

}
