import { MapLayerDto } from './Map.dto';
import { RiskPointDto } from './RiskPoint.dto';

export interface ChartSeriesDto {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface RankingDto {
  rank: number;
  label: string;
  quantity: number;
  totalKg: number;
}

export interface CancellationAnalysisResponseDto {
  donors: ChartSeriesDto[];
  donationPoints: ChartSeriesDto[];
  cancellationVolume: ChartSeriesDto[];
  cancellationCount: ChartSeriesDto[];
  topDonors: RankingDto[];
  topDonationPoints: RankingDto[];
}

export interface ScatterPointDto {
  label: string;
  x: number;
  y: number;
  size: number;
  riskLevel: string;
}

export interface PredictiveAnalysisResponseDto {
  highestRiskPoint: RiskPointDto | null;
  highestRiskDonor: RiskPointDto | null;
  excellentPoints: RiskPointDto[];
  topRiskDonors: RiskPointDto[];
  topRiskDonationPoints: RiskPointDto[];
  scatterPlot: ScatterPointDto[];
  semaphoreMap: MapLayerDto[];
}
