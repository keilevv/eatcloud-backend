import { Router } from 'express';
import { API_PREFIX, AUTH_ROUTES, DASHBOARD_ROUTES } from '../constants';
import { authRouter } from './auth.routes';
import { dashboardRouter } from './dashboard.routes';
import { healthRouter } from './health.routes';

const router: Router = Router();

router.use('/health', healthRouter);
router.use(`${API_PREFIX}${AUTH_ROUTES.BASE}`, authRouter);
router.use(`${API_PREFIX}${DASHBOARD_ROUTES.BASE}`, dashboardRouter);

export { router as routes };
