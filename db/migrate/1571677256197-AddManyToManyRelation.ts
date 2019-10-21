import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class AddManyToManyRelation1571677256197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const childId: TableColumn = new TableColumn({ name: 'childId', type: 'integer', isNullable: false });
    const sponsorId: TableColumn = new TableColumn({ name: 'sponsorId', type: 'integer', isNullable: false });

    const childSponsorsSponsorTable: Table = new Table({ name: 'child_sponsors_sponsor', columns: [childId, sponsorId] });

    await queryRunner.createTable(childSponsorsSponsorTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('child_sponsors_sponsor', true);
  }
}
