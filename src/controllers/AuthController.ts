import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants';
import { LoginRequestDto, RegisterRequestDto } from '../dto';
import { authService } from '../services/AuthService';
import { sendSuccess } from '../utils/api-response';

export class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as RegisterRequestDto;
      const user = await authService.register(body);

      sendSuccess(
        res,
        user,
        SUCCESS_MESSAGES.USER_REGISTERED,
        HTTP_STATUS.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as LoginRequestDto;
      const result = await authService.login(body);

      sendSuccess(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Authentication required',
          errors: [],
        });
        return;
      }

      sendSuccess(res, req.user);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
