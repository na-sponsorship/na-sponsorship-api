import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class initialChildTable1560147604095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'child',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'dateOfBirth',
            type: 'date',
          },
          {
            name: 'grade',
            type: 'varchar',
          },
          {
            name: 'gender',
            type: 'varchar',
            enum: ['male', 'female'],
          },
          {
            name: 'picture',
            type: 'varchar',
          },
          {
            name: 'story',
            type: 'text',
          },
          {
            name: 'sponsorsNeeded',
            type: 'int2',
          },
          {
            name: 'activeSponsors',
            type: 'int2',
          },
          {
            name: 'stripeProduct',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('child');
  }
}
