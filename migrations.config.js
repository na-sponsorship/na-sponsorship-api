module.exports = {
  migrations: [process.env.TYPEORM_MIGRATIONS],
  type: 'postgres',
  url: process.env.DATABASE_URL,
};
