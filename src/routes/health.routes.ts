import { Router, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants';

const healthRouter: Router = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export { healthRouter };
