import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetDefaultValuesForNonNullable1573338078591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const updatedSponsorsNeeedColumn: TableColumn = new TableColumn({
      name: 'sponsorsNeeded',
      type: 'int4',
      isNullable: false,
      default: 0,
    });
    const updatedActiveSponsorsColumn: TableColumn = new TableColumn({
      name: 'activeSponsors',
      type: 'int4',
      isNullable: false,
      default: 0,
    });

    await queryRunner.changeColumn('child', 'sponsorsNeeded', updatedSponsorsNeeedColumn);
    await queryRunner.changeColumn('child', 'activeSponsors', updatedActiveSponsorsColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const oldSponsorsNeeedColumn: TableColumn = new TableColumn({
      name: 'sponsorsNeeded',
      type: 'int4',
      isNullable: false,
    });
    const oldActiveSponsorsColumn: TableColumn = new TableColumn({
      name: 'activeSponsors',
      type: 'int4',
      isNullable: false,
    });

    await queryRunner.changeColumn('child', 'sponsorsNeeded', oldSponsorsNeeedColumn);
    await queryRunner.changeColumn('child', 'activeSponsors', oldActiveSponsorsColumn);
  }
}
