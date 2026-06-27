import { Sequelize } from 'sequelize';
import { appConfig } from '../config';

const { database, isProduction } = appConfig;

export const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: 'postgres',
    logging: isProduction ? false : console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export const connectDatabase = async (): Promise<void> => {
  await sequelize.authenticate();
};

export const disconnectDatabase = async (): Promise<void> => {
  await sequelize.close();
};
