export interface CancellationAnalysisKpiDto {
  totalCancelled: number;
  totalKgCancelled: number;
  cancellationProbability: number;
  totalGeneral: number;
}

export interface CancellationAnalysisSummaryDto {
  totalDonors: number;
  totalDonationPoints: number;
  totalBeneficiaries: number;
  averageCancellationProbability: number;
  filteredRecords: number;
}

export interface CancellationAnalysisResponseDto {
  kpis: CancellationAnalysisKpiDto;
  summary: CancellationAnalysisSummaryDto;
}

export interface CacheRefreshResponseDto {
  refreshed: boolean;
  loadedAt: string;
}
