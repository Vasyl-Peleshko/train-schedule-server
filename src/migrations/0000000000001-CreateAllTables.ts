import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAllTables0000000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password_hash', type: 'varchar' },
          { name: 'role', type: 'varchar', default: "'user'" },
          { name: 'refresh_token', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'schedules',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'train_number', type: 'varchar' },
          { name: 'origin', type: 'varchar' },
          { name: 'destination', type: 'varchar' },
          { name: 'departure_time', type: 'timestamp' },
          { name: 'arrival_time', type: 'timestamp' },
          { name: 'status', type: 'varchar', default: "'on-time'" },
          { name: 'created_byId', type: 'int', isNullable: true },
          { name: 'updated_byId', type: 'int', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('schedules', [
      new TableForeignKey({
        columnNames: ['created_byId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['updated_byId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('schedules');
    const foreignKeys = table!.foreignKeys;
    await queryRunner.dropForeignKeys('schedules', foreignKeys);

    await queryRunner.dropTable('schedules');
    await queryRunner.dropTable('users');
  }
}
