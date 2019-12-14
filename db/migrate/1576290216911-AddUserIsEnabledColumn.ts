import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserIsEnabledColumn1576290216911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const column: TableColumn = new TableColumn({
      name: 'isEnabled',
      type: 'boolean',
      default: false,
    });

    await queryRunner.addColumn('user', column);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'isEnabled');
  }
}
