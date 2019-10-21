import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RefactorSponsor1571635971414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('sponsor', 'temporaryCode');
    await queryRunner.dropColumn('sponsor', 'passcodeGeneratedDate');
    await queryRunner.query(`ALTER TABLE sponsor ALTER COLUMN "stripeCustomer" TYPE varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('sponsor', new TableColumn({ name: 'temporaryCode', type: 'varchar', isNullable: true }));
    await queryRunner.addColumn('sponsor', new TableColumn({ name: 'passcodeGeneratedDate', type: 'date', isNullable: true }));
    await queryRunner.query(`ALTER TABLE sponsor ALTER COLUMN "stripeCustomer" TYPE int4 USING (trim("stripeCustomer")::integer)`);
  }
}
