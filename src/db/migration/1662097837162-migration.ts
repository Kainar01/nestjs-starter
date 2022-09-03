import type { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662097837162 implements MigrationInterface {
    name = 'migration1662097837162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
