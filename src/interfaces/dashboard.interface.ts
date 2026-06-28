export interface RawKpis {
  total_canceladas: number;
  total_kg_canceladas: number;
  probabilidad_cancelacion: number;
  total_general: number;
}

export interface RawDonorChartItem {
  'eatc-donor': string;
  cantidad: number;
  total_kg: number;
}

export interface RawMapPoint {
  'eatc-lat': number;
  'eatc-lon': number;
  'eatc-donor': string;
  'eatc-pod_name': string;
  cantidad: number;
  total_kg: number;
}

export interface RawRiskPoint {
  donor: string;
  pod_name: string;
  total: number;
  canceladas: number;
  probabilidad: number;
  lat: number;
  lon: number;
  total_kg: number;
}

export interface RawRiskDonor {
  donor: string;
  total: number;
  canceladas: number;
  probabilidad: number;
  total_kg: number;
}

export interface RawBeneficiary {
  lat: number;
  lon: number;
  nombre: string;
  telefono: string;
  estado: string;
}

export interface RawDashboardDataset {
  kpis: RawKpis;
  graficos: {
    donantes: RawDonorChartItem[];
  };
  mapas: RawMapPoint[];
  riesgo: {
    puntos: RawRiskPoint[];
    donantes: RawRiskDonor[];
  };
  beneficiarios_tipologias: {
    tipo_1: RawBeneficiary[];
    tipo_2: RawBeneficiary[];
    tipo_3: RawBeneficiary[];
  };
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BeneficiaryType = 'T1' | 'T2' | 'T3';

export interface NormalizedKpi {
  totalCancelled: number;
  totalKgCancelled: number;
  cancellationProbability: number;
  totalGeneral: number;
}

export interface NormalizedDonorChartItem {
  donor: string;
  quantity: number;
  totalKg: number;
}

export interface NormalizedMapPoint {
  latitude: number;
  longitude: number;
  donor: string;
  donationPoint: string;
  city: string;
  department: string;
  quantity: number;
  totalKg: number;
}

export interface NormalizedRiskPoint {
  donor: string;
  donationPoint: string;
  total: number;
  cancelled: number;
  probability: number;
  latitude: number;
  longitude: number;
  totalKg: number;
  city: string;
  department: string;
  riskLevel: RiskLevel;
}

export interface NormalizedRiskDonor {
  donor: string;
  total: number;
  cancelled: number;
  probability: number;
  totalKg: number;
  riskLevel: RiskLevel;
}

export interface NormalizedBeneficiary {
  latitude: number;
  longitude: number;
  name: string;
  phone: string;
  status: string;
  type: BeneficiaryType;
  city: string;
  department: string;
  riskLevel: RiskLevel;
}

export interface NormalizedDashboardData {
  kpis: NormalizedKpi;
  donorCharts: NormalizedDonorChartItem[];
  mapPoints: NormalizedMapPoint[];
  riskPoints: NormalizedRiskPoint[];
  riskDonors: NormalizedRiskDonor[];
  beneficiaries: NormalizedBeneficiary[];
}

export interface DashboardFilters {
  donor?: string;
  donationPoint?: string;
  city?: string;
  department?: string;
  riskLevel?: RiskLevel;
  beneficiaryType?: BeneficiaryType;
  beneficiaryStatus?: string;
  limit?: number;
}
