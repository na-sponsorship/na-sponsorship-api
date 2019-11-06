module.exports = {
  entities: ["src/**/*.entity.{ts,js}"],
  extra: { ssl: process.env.TYPEORM_SSL },
  migrations: [process.env.TYPEORM_MIGRATIONS],
  type: "postgres",
  url: process.env.DATABASE_URL,
};
