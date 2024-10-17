import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const db = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: "postgres",
    host: dbHost,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    port: 5432,
    ssl: true,
});

export default db;