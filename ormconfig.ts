const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  ssl: process.env.NODE_ENV !== 'local',
  entities: [process.cwd() + '**/*.entity{.ts,.js}'],
  migrationsRun: process.env.NODE_ENV !== 'local',
  migrations: [process.cwd() + '/db_migrations/migrations/*{.ts,.js}'],
  logging: true,
  logger: 'file',
  synchronize: process.env.NODE_ENV === 'local',
};
