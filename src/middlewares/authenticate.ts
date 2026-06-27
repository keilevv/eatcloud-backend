import { NextFunction, Request, Response } from 'express';
import { AUTH_HEADER_PREFIX, ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { authService } from '../services/AuthService';
import { AppError } from '../utils/app-error';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith(`${AUTH_HEADER_PREFIX} `)) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_MISSING,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const token = authHeader.slice(AUTH_HEADER_PREFIX.length + 1).trim();

    if (!token) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_MISSING,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const payload = verifyAccessToken(token);
    const user = await authService.getCurrentUser(payload.userId);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
