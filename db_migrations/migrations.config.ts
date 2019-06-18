import * as dotenv from 'dotenv';
import { SentryLogger } from './migrations.logger';

dotenv.config({ path: 'environment.env' });
console.log('env: ' + process.env.NODE_ENV)
export = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USER,
  password: process.env.TYPEORM_PASS,
  database: process.env.TYPEORM_DATABASE,
  ssl: process.env.NODE_ENV !== 'local',
  entities: [process.cwd() + '/src/**/*.entity{.ts,.js}'],
  migrationsRun: true,
  migrations: [process.cwd() + '/db_migrations/migrations/*{.ts,.js}'],
  logging: true,
  logger: new SentryLogger(),
};
