const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const db = new Sequelize(
  process.env.LOCAL_DATABASE_NAME,
  process.env.LOCAL_DATABASE_USERNAME,
  process.env.LOCAL_DATABASE_PASSWORD,
  {
    host: process.env.LOCAL_DATABASE_HOST,
    dialect: process.env.LOCAL_DATABASE_DIALECT,
  }
);

module.exports = db;
