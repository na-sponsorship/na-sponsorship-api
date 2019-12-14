import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserIdToSponsor1576307295886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const column: TableColumn = new TableColumn({
      name: 'userId',
      type: 'integer',
      isNullable: true,
    });

    await queryRunner.addColumn('sponsor', column);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('sponsor', 'userId');
  }
}
