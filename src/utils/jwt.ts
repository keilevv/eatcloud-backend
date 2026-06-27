import jwt, { JwtPayload as JsonWebTokenPayload } from 'jsonwebtoken';
import { appConfig } from '../config';
import { AppError } from './app-error';
import { HTTP_STATUS } from '../constants';
import { ERROR_MESSAGES } from '../constants';

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

const ensureJwtSecret = (): string => {
  if (!appConfig.jwt.secret) {
    throw new AppError(
      ERROR_MESSAGES.JWT_SECRET_MISSING,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  return appConfig.jwt.secret;
};

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ensureJwtSecret(), {
    expiresIn: appConfig.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, ensureJwtSecret());

    if (typeof decoded === 'string') {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const payload = decoded as JsonWebTokenPayload & AccessTokenPayload;

    if (!payload.userId || !payload.email) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    throw error;
  }
};

export const decodeAccessToken = (token: string): AccessTokenPayload | null => {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === 'string') {
    return null;
  }

  const payload = decoded as JsonWebTokenPayload & AccessTokenPayload;

  if (!payload.userId || !payload.email) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
};
