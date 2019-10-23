import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addUserName1571838494634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const firstName: TableColumn = new TableColumn({ name: 'firstName', type: 'varchar', isNullable: true });
    const lastName: TableColumn = new TableColumn({ name: 'lastName', type: 'varchar', isNullable: true });

    await queryRunner.addColumns('user', [firstName, lastName]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'firstName');
    await queryRunner.dropColumn('user', 'lastName');
  }
}
