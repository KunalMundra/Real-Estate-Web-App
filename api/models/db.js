import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize('bytforce', 'root', 'Tushar', {
  host: process.env.MYSQL_HOST || 'localhost',
  dialect: 'mysql',
});

export default sequelize;
