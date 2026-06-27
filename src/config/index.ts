import { config } from 'dotenv';

config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

const getOptionalEnv = (key: string, defaultValue: string): string => {
  return process.env[key] ?? defaultValue;
};

const nodeEnv = getOptionalEnv('NODE_ENV', 'development');

export const appConfig: AppConfig = {
  port: Number.parseInt(getOptionalEnv('PORT', '3000'), 10),
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  database: {
    host: getOptionalEnv('DATABASE_HOST', 'localhost'),
    port: Number.parseInt(getOptionalEnv('DATABASE_PORT', '5432'), 10),
    name: getOptionalEnv('DATABASE_NAME', 'eatcloud'),
    user: getOptionalEnv('DATABASE_USER', 'postgres'),
    password: getOptionalEnv('DATABASE_PASSWORD', 'postgres'),
  },
  jwt: {
    secret: getOptionalEnv('JWT_SECRET', ''),
    expiresIn: getOptionalEnv('JWT_EXPIRES_IN', '7d'),
  },
};
