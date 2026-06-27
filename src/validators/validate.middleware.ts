import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { AppError } from '../utils/app-error';

export const validate = (
  validations: ValidationChain[],
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: 'path' in error ? String(error.path) : 'unknown',
        message: error.msg as string,
      }));

      next(
        new AppError(
          ERROR_MESSAGES.VALIDATION_FAILED,
          HTTP_STATUS.BAD_REQUEST,
          formattedErrors,
        ),
      );
      return;
    }

    next();
  };
};
