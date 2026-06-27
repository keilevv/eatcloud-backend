import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { appConfig } from './config';
import { MORGAN_FORMAT } from './constants';
import { errorHandler, notFoundHandler } from './middlewares';
import { routes } from './routes';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(
    morgan(
      appConfig.isProduction
        ? MORGAN_FORMAT.PRODUCTION
        : MORGAN_FORMAT.DEVELOPMENT,
    ),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
