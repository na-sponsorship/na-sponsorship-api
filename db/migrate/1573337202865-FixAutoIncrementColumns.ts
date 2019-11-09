import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class FixAutoIncrementColumns1573337202865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const updatedIdColumn: TableColumn = new TableColumn({ name: 'id', type: 'int4', isNullable: false, isGenerated: true, isPrimary: true });

    await queryRunner.changeColumn('child', 'id', updatedIdColumn);
    await queryRunner.changeColumn('user', 'id', updatedIdColumn);
    await queryRunner.changeColumn('sponsor', 'id', updatedIdColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const oldColumnId: TableColumn = new TableColumn({ name: 'id', type: 'int4', isNullable: false, isPrimary: true });

    await queryRunner.changeColumn('child', 'id', oldColumnId);
    await queryRunner.changeColumn('sponsor', 'id', oldColumnId);
    await queryRunner.changeColumn('user', 'id', oldColumnId);
  }
}
