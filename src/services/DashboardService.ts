import { DashboardFilters } from '../interfaces/dashboard.interface';
import { aggregator } from '../utils/Aggregator';
import { dashboardCache } from '../utils/DashboardCache';
import {
  BeneficiaryAnalysisResponseDto,
  CacheRefreshResponseDto,
  CancellationAnalysisResponseDto,
  EcosystemResponseDto,
  FilterOptionsDto,
  OverviewResponseDto,
  PredictiveAnalysisResponseDto,
} from '../dto/Dashboard.dto';

export class DashboardService {
  async getOverview(filters: DashboardFilters): Promise<OverviewResponseDto> {
    const data = await dashboardCache.load();
    return aggregator.buildOverview(data, filters);
  }

  async getCancellationAnalysis(
    filters: DashboardFilters,
  ): Promise<CancellationAnalysisResponseDto> {
    const data = await dashboardCache.load();
    return aggregator.buildCancellationAnalysis(data, filters);
  }

  async getPredictiveAnalysis(
    filters: DashboardFilters,
  ): Promise<PredictiveAnalysisResponseDto> {
    const data = await dashboardCache.load();
    return aggregator.buildPredictiveAnalysis(data, filters);
  }

  async getBeneficiaries(
    filters: DashboardFilters,
  ): Promise<BeneficiaryAnalysisResponseDto> {
    const data = await dashboardCache.load();
    return aggregator.buildBeneficiaries(data, filters);
  }

  async getEcosystem(filters: DashboardFilters): Promise<EcosystemResponseDto> {
    const data = await dashboardCache.load();
    return aggregator.buildEcosystem(data, filters);
  }

  async getFilterOptions(): Promise<FilterOptionsDto> {
    const data = await dashboardCache.load();
    return aggregator.buildFilterOptions(data);
  }

  async refreshCache(): Promise<CacheRefreshResponseDto> {
    await dashboardCache.refresh();

    return {
      refreshed: true,
      loadedAt: new Date().toISOString(),
    };
  }

  isCacheLoaded(): boolean {
    return dashboardCache.isLoaded();
  }
}

export const dashboardService = new DashboardService();
