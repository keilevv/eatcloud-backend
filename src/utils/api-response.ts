import { Response } from 'express';
import { HTTP_STATUS } from '../constants';
import type { ApiErrorDetail } from './app-error';

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: ApiErrorDetail[];
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = HTTP_STATUS.OK,
): Response<ApiSuccessResponse<T>> => {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  if (message !== undefined) {
    body.message = message;
  }

  return res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors: ApiErrorDetail[] = [],
): Response<ApiErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
