import { createApp } from './app';
import { appConfig } from './config';
import { connectDatabase, disconnectDatabase } from './database';
import { loadEnvironment } from './utils/env-loader';
import { logger } from './utils/logger';

loadEnvironment();

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    logger.info('Database connection established');

    const app = createApp();

    const server = app.listen(appConfig.port, () => {
      logger.info(`Server running on port ${appConfig.port}`, {
        environment: appConfig.nodeEnv,
      });
    });

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server shut down successfully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => {
      void shutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
      void shutdown('SIGINT');
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
