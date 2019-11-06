import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class DBInit1524330356000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const childTable: Table = new Table({
      name: 'child',
      columns: [
        new TableColumn({ name: 'id', type: 'int4', isNullable: false, isPrimary: true }),
        new TableColumn({ name: 'firstName', type: 'varchar', isNullable: false }),
        new TableColumn({ name: 'lastName', type: 'varchar', isNullable: false }),
        new TableColumn({ name: 'dateOfBirth', type: 'date', isNullable: true }),
        new TableColumn({ name: 'grade', type: 'int4', isNullable: true }),
        new TableColumn({ name: 'story', type: 'text', isNullable: true }),
        new TableColumn({ name: 'gender', type: 'varchar', isNullable: true }),
        new TableColumn({ name: 'stripeProduct', type: 'varchar', isNullable: true }),
        new TableColumn({ name: 'sponsorsNeeded', type: 'int4', isNullable: false }),
        new TableColumn({ name: 'activeSponsors', type: 'int4', isNullable: false }),
        new TableColumn({ name: 'image', type: 'varchar', isNullable: true }),
      ],
    });

    const sponsorTable: Table = new Table({
      name: 'sponsor',
      columns: [
        new TableColumn({ name: 'id', type: 'int4', isNullable: false, isPrimary: true }),
        new TableColumn({ name: 'email', type: 'varchar', isNullable: true }),
        new TableColumn({ name: 'temporaryCode', type: 'varchar', isNullable: true }),
        new TableColumn({ name: 'passcodeGeneratedDate', type: 'date', isNullable: true }),
        new TableColumn({ name: 'stripeCustomer', type: 'int4', isNullable: true }),
        new TableColumn({ name: 'loginAttempts', type: 'date', isNullable: true }),
      ],
    });

    const userTable: Table = new Table({
      name: 'user',
      columns: [
        new TableColumn({ name: 'id', type: 'int4', isNullable: false, isPrimary: true }),
        new TableColumn({ name: 'username', type: 'varchar', isNullable: false }),
        new TableColumn({ name: 'password', type: 'varchar', isNullable: false }),
      ],
    });

    const childSponsorJoin: Table = new Table({
      name: 'child_sponsors_sponsor',
      columns: [
        new TableColumn({ name: 'childId', type: 'int4', isNullable: false }),
        new TableColumn({ name: 'sponsorId', type: 'int4', isNullable: false }),
      ],
    });

    await queryRunner.createTable(childTable, true);
    await queryRunner.createTable(sponsorTable, true);
    await queryRunner.createTable(userTable, true);
    await queryRunner.createTable(childSponsorJoin, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('child');
    await queryRunner.dropTable('sponsor');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('child_sponsors_sponsor');
  }
}
