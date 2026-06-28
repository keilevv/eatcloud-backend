export interface KpiDto {
  totalCancelled: number;
  totalKgCancelled: number;
  cancellationProbability: number;
  totalGeneral: number;
}

export interface OverviewSummaryDto {
  totalDonors: number;
  totalDonationPoints: number;
  totalBeneficiaries: number;
  averageCancellationProbability: number;
  filteredRecords: number;
}

export interface OverviewResponseDto {
  kpis: KpiDto;
  summary: OverviewSummaryDto;
}

export interface CacheRefreshResponseDto {
  refreshed: boolean;
  loadedAt: string;
}
