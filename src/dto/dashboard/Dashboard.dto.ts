import { MapLayerDto } from './Map.dto';

export interface BeneficiaryResponseDto {
  name: string;
  phone: string;
  status: string;
  type: string;
  latitude: number;
  longitude: number;
  city: string;
  department: string;
  riskLevel: string;
}

export interface BeneficiaryAnalysisResponseDto {
  visualization: {
    totalBeneficiaries: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  locations: BeneficiaryResponseDto[];
  operationalStatus: Record<string, number>;
  riskIndicators: Record<string, number>;
}

export interface EcosystemDonationPointDto {
  donationPoint: string;
  quantity: number;
  totalKg: number;
}

export interface EcosystemResponseDto {
  donationPoints: EcosystemDonationPointDto[];
  beneficiaries: BeneficiaryResponseDto[];
  typologies: Record<string, number>;
  operationalStates: Record<string, number>;
  mapLayers: MapLayerDto[];
}

export type {
  CancellationAnalysisResponseDto,
  CancellationAnalysisKpiDto,
  CancellationAnalysisSummaryDto,
  CacheRefreshResponseDto,
} from './CancellationAnalysisDto';
export type {
  ChartSeriesDto,
  RankingDto,
  // CancellationAnalysisResponseDto,
  ScatterPointDto,
  PredictiveAnalysisResponseDto,
} from './Chart.dto';
export type { MapLayerDto, MarkerDto, HeatmapPointDto } from './Map.dto';
export type { FilterOptionsDto } from './Filter.dto';
export type { RiskPointDto } from './RiskPoint.dto';
