import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSoftDelete1571504759646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const column: TableColumn = new TableColumn({
      name: 'deleted',
      type: 'boolean',
      default: false,
    });

    await queryRunner.addColumn('child', new TableColumn(column));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('child', 'deleted');
  }
}
