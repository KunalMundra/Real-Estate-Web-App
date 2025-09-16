import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize('myrealestate', 'root', 'root', {
  host: process.env.MYSQL_HOST || 'localhost',
  dialect: 'mysql',
});

export default sequelize;
