import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDeletedToArchived1571539248100
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.renameColumn('child', 'deleted', 'archived');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.renameColumn('child', 'deleted', 'archived');
  }
}
