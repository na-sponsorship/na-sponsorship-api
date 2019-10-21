import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AdduserRole1571692177745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roleColumn: TableColumn = new TableColumn({ name: 'role', type: 'varchar', isNullable: true });

    await queryRunner.addColumn('user', roleColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'role');
  }
}
