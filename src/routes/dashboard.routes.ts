import { Router } from 'express';
import { dashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middlewares/authenticate';
import { dashboardFilterValidator, validate } from '../validators';

const dashboardRouter: Router = Router();

const withFilters = validate(dashboardFilterValidator);

/**
 * @openapi
 * /api/dashboard/cancellation-analysis:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard overview
 *     description: Returns KPIs and global summary statistics for the dashboard.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DonorFilter'
 *       - $ref: '#/components/parameters/DonationPointFilter'
 *       - $ref: '#/components/parameters/CityFilter'
 *       - $ref: '#/components/parameters/DepartmentFilter'
 *       - $ref: '#/components/parameters/RiskLevelFilter'
 *       - $ref: '#/components/parameters/BeneficiaryTypeFilter'
 *       - $ref: '#/components/parameters/BeneficiaryStatusFilter'
 *       - $ref: '#/components/parameters/LimitFilter'
 *     responses:
 *       200:
 *         description: Dashboard overview retrieved successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation failed
 */
dashboardRouter.get(
  '/cancellation-analysis',
  authenticate,
  withFilters,
  dashboardController.cancellationAnalysis,
);

/**
 * @openapi
 * /api/dashboard/cancellation-analysis:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get cancellation analysis
 *     description: Returns charts and rankings related to cancellations by donor and donation point.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DonorFilter'
 *       - $ref: '#/components/parameters/DonationPointFilter'
 *       - $ref: '#/components/parameters/CityFilter'
 *       - $ref: '#/components/parameters/DepartmentFilter'
 *       - $ref: '#/components/parameters/RiskLevelFilter'
 *       - $ref: '#/components/parameters/LimitFilter'
 *     responses:
 *       200:
 *         description: Cancellation analysis retrieved successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get(
  '/cancellation-analysis',
  authenticate,
  withFilters,
  dashboardController.cancellationAnalysis,
);

/**
 * @openapi
 * /api/dashboard/predictive-analysis:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get predictive analysis
 *     description: Returns risk rankings, excellent points, scatter plot and semaphore map datasets.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DonorFilter'
 *       - $ref: '#/components/parameters/DonationPointFilter'
 *       - $ref: '#/components/parameters/CityFilter'
 *       - $ref: '#/components/parameters/DepartmentFilter'
 *       - $ref: '#/components/parameters/RiskLevelFilter'
 *       - $ref: '#/components/parameters/LimitFilter'
 *     responses:
 *       200:
 *         description: Predictive analysis retrieved successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get(
  '/predictive-analysis',
  authenticate,
  withFilters,
  dashboardController.predictiveAnalysis,
);

/**
 * @openapi
 * /api/dashboard/beneficiaries:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get beneficiary analysis
 *     description: Returns beneficiary visualization, locations, operational status and risk indicators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CityFilter'
 *       - $ref: '#/components/parameters/DepartmentFilter'
 *       - $ref: '#/components/parameters/BeneficiaryTypeFilter'
 *       - $ref: '#/components/parameters/BeneficiaryStatusFilter'
 *       - $ref: '#/components/parameters/RiskLevelFilter'
 *       - $ref: '#/components/parameters/LimitFilter'
 *     responses:
 *       200:
 *         description: Beneficiary analysis retrieved successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get(
  '/beneficiaries',
  authenticate,
  withFilters,
  dashboardController.beneficiaries,
);

/**
 * @openapi
 * /api/dashboard/ecosystem:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get ecosystem data
 *     description: Returns the complete ecosystem including donation points, beneficiaries, typologies and map layers.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DonorFilter'
 *       - $ref: '#/components/parameters/DonationPointFilter'
 *       - $ref: '#/components/parameters/CityFilter'
 *       - $ref: '#/components/parameters/DepartmentFilter'
 *       - $ref: '#/components/parameters/BeneficiaryTypeFilter'
 *       - $ref: '#/components/parameters/BeneficiaryStatusFilter'
 *       - $ref: '#/components/parameters/RiskLevelFilter'
 *       - $ref: '#/components/parameters/LimitFilter'
 *     responses:
 *       200:
 *         description: Ecosystem data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get(
  '/ecosystem',
  authenticate,
  withFilters,
  dashboardController.ecosystem,
);

/**
 * @openapi
 * /api/dashboard/filter-options:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard filter options
 *     description: Returns all available filter values for dashboard endpoints.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get(
  '/filter-options',
  authenticate,
  dashboardController.filterOptions,
);

/**
 * @openapi
 * /api/dashboard/cache/refresh:
 *   post:
 *     tags:
 *       - Dashboard
 *     summary: Refresh dashboard cache
 *     description: Reloads and re-parses the dashboard dataset into memory. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard cache refreshed successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.post(
  '/cache/refresh',
  authenticate,
  dashboardController.refreshCache,
);

export { dashboardRouter };
