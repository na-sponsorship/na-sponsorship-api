import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class AddSponsorName1571682356153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const firstName: TableColumn = new TableColumn({ name: 'firstName', type: 'varchar', isNullable: true });
    const lastName: TableColumn = new TableColumn({ name: 'lastName', type: 'varchar', isNullable: true });

    await queryRunner.addColumns('sponsor', [firstName, lastName]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('sponsor', 'firstName');
    await queryRunner.dropColumn('sponsor', 'lastName');
  }
}
