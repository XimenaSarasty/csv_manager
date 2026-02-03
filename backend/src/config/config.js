require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // Schema personalizado - NO usar 'public'
    schema: 'csv_app',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Opciones adicionales para migraciones
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'SequelizeMeta',
    migrationStorageTableSchema: 'csv_app'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: 'csv_app',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'SequelizeMeta',
    migrationStorageTableSchema: 'csv_app'
  }
};
