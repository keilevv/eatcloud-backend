import { Router } from 'express';
import { API_PREFIX, AUTH_ROUTES } from '../constants';
import { authRouter } from './auth.routes';
import { healthRouter } from './health.routes';

const router: Router = Router();

router.use('/health', healthRouter);
router.use(`${API_PREFIX}${AUTH_ROUTES.BASE}`, authRouter);

export { router as routes };
