import { Router } from 'express';
import { healthRouter } from './health.routes';

const router: Router = Router();

router.use('/health', healthRouter);

export { router as routes };
