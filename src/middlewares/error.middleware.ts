import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { appConfig } from '../config';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
    errors: [],
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: appConfig.isProduction ? undefined : err.stack,
  });

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    errors: [],
  });
};
