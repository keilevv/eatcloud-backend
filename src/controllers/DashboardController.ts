import { NextFunction, Request, Response } from 'express';
import { SUCCESS_MESSAGES } from '../constants';
import { DashboardFilters } from '../interfaces/dashboard.interface';
import { dashboardService } from '../services/DashboardService';
import { sendSuccess } from '../utils/api-response';

const getFilters = (req: Request): DashboardFilters => ({
  donor: req.query.donor as string | undefined,
  donationPoint: req.query.donationPoint as string | undefined,
  city: req.query.city as string | undefined,
  department: req.query.department as string | undefined,
  riskLevel: req.query.riskLevel as DashboardFilters['riskLevel'],
  beneficiaryType: req.query
    .beneficiaryType as DashboardFilters['beneficiaryType'],
  beneficiaryStatus: req.query.beneficiaryStatus as string | undefined,
  limit: req.query.limit ? Number(req.query.limit) : undefined,
});

export class DashboardController {
  cancellationAnalysis = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await dashboardService.getCancellationAnalysis(
        getFilters(req),
      );
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_OVERVIEW);
    } catch (error) {
      next(error);
    }
  };

  predictiveAnalysis = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await dashboardService.getPredictiveAnalysis(
        getFilters(req),
      );
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_PREDICTIVE_ANALYSIS);
    } catch (error) {
      next(error);
    }
  };

  beneficiaries = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await dashboardService.getBeneficiaries(getFilters(req));
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_BENEFICIARIES);
    } catch (error) {
      next(error);
    }
  };

  ecosystem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await dashboardService.getEcosystem(getFilters(req));
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_ECOSYSTEM);
    } catch (error) {
      next(error);
    }
  };

  filterOptions = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await dashboardService.getFilterOptions();
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_FILTER_OPTIONS);
    } catch (error) {
      next(error);
    }
  };

  refreshCache = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await dashboardService.refreshCache();
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_CACHE_REFRESHED);
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();
