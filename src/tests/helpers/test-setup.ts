import { Application } from 'express';
import { createApp } from '../../app';
import { connectDatabase, disconnectDatabase, sequelize } from '../../database';
import '../../models';
import { loadEnvironment } from '../../utils/env-loader';

loadEnvironment();

export const buildTestApp = (): Application => createApp();

export const setupTestDatabase = async (): Promise<void> => {
  await connectDatabase();
};

export const cleanupUsers = async (): Promise<void> => {
  await sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
};

export const teardownTestDatabase = async (): Promise<void> => {
  await disconnectDatabase();
};
