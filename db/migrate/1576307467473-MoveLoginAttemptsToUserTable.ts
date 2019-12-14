import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MoveLoginAttemptsToUserTable1576307467473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const column: TableColumn = new TableColumn({
      name: 'loginAttempts',
      type: 'integer',
      default: 0,
    });

    await queryRunner.dropColumn('sponsor', 'loginAttempts');
    await queryRunner.addColumn('user', column);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const column: TableColumn = new TableColumn({
      name: 'loginAttempts',
      type: 'date',
      isNullable: true,
    });

    await queryRunner.addColumn('sponsor', column);
    await queryRunner.dropColumn('user', 'loginAttempts');
  }
}
