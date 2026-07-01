import {
  BeneficiaryType,
  NormalizedBeneficiary,
  NormalizedDashboardData,
  NormalizedDonorChartItem,
  NormalizedKpi,
  NormalizedMapPoint,
  NormalizedRiskDonor,
  NormalizedRiskPoint,
  RawBeneficiary,
  RawDashboardDataset,
  RawDonorChartItem,
  RawMapPoint,
  RawRiskDonor,
  RawRiskPoint,
  RiskLevel,
} from '../interfaces/dashboard.interface';

const CITY_TO_DEPARTMENT: Record<string, string> = {
  BOGOTA: 'Cundinamarca',
  CALI: 'Valle del Cauca',
  MEDELLIN: 'Antioquia',
  NEIVA: 'Huila',
  PASTO: 'Nariño',
  POPAYAN: 'Cauca',
  FLORENCIA: 'Caquetá',
  IPIALES: 'Nariño',
  PITALITO: 'Huila',
  BUCARAMANGA: 'Santander',
  CUCUTA: 'Norte de Santander',
  CAUCASIA: 'Antioquia',
  FUSAGASUGA: 'Cundinamarca',
  JAMUNDI: 'Valle del Cauca',
  ARMENIA: 'Quindío',
  MANIZALES: 'Caldas',
  PEREIRA: 'Risaralda',
  CARTAGENA: 'Bolívar',
  BARRANQUILLA: 'Atlántico',
  MONTERIA: 'Córdoba',
  IBAGUE: 'Tolima',
  VILLAVICENCIO: 'Meta',
  SANTA: 'Magdalena',
  VALLEDUPAR: 'Cesar',
  SINCELEJO: 'Sucre',
  TUNJA: 'Boyacá',
  RIOHACHA: 'La Guajira',
};

const normalizeString = (value: string): string => value.trim().toLowerCase();

export const resolveRiskLevel = (probability: number): RiskLevel => {
  if (probability === 0) {
    return 'LOW';
  }

  if (probability <= 0.3) {
    return 'MEDIUM';
  }

  if (probability <= 0.7) {
    return 'HIGH';
  }

  return 'CRITICAL';
};

export const extractCityFromDonationPoint = (donationPoint: string): string => {
  const normalized = donationPoint.trim().toUpperCase();
  const withoutPrefix = normalized
    .replace(/^\d+\s*-\s*/, '')
    .replace(/^(EXITO|CARULLA|KFC|XITO|SUPER INTER)\s+/i, '')
    .trim();

  if (!withoutPrefix) {
    return normalized;
  }

  const tokens = withoutPrefix.split(/\s+/).filter(Boolean);

  if (tokens.length === 1) {
    return tokens[0] ?? normalized;
  }

  const lastTwo = tokens.slice(-2).join(' ');
  const lastOne = tokens[tokens.length - 1] ?? normalized;

  if (CITY_TO_DEPARTMENT[lastTwo]) {
    return lastTwo;
  }

  return lastOne;
};

export const deriveDepartment = (
  city: string,
  latitude: number,
  longitude: number,
): string => {
  const normalizedCity = city.toUpperCase();

  if (CITY_TO_DEPARTMENT[normalizedCity]) {
    return CITY_TO_DEPARTMENT[normalizedCity];
  }

  for (const [cityKey, department] of Object.entries(CITY_TO_DEPARTMENT)) {
    if (normalizedCity.includes(cityKey) || cityKey.includes(normalizedCity)) {
      return department;
    }
  }

  if (latitude >= 4 && latitude <= 5 && longitude >= -76 && longitude <= -74) {
    return 'Valle del Cauca';
  }

  if (latitude >= 6 && latitude <= 7 && longitude >= -76 && longitude <= -75) {
    return 'Antioquia';
  }

  if (
    latitude >= 4.4 &&
    latitude <= 4.8 &&
    longitude >= -74.2 &&
    longitude <= -73.9
  ) {
    return 'Cundinamarca';
  }

  return 'Unknown';
};

const normalizeNumber = (value: unknown, fieldName: string): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number for ${fieldName}`);
  }

  return parsed;
};

const normalizeKpis = (raw: RawDashboardDataset['kpis']): NormalizedKpi => ({
  totalCancelled: normalizeNumber(raw.total_canceladas, 'total_canceladas'),
  totalKgCancelled: normalizeNumber(
    raw.total_kg_canceladas,
    'total_kg_canceladas',
  ),
  cancellationProbability: normalizeNumber(
    raw.probabilidad_cancelacion,
    'probabilidad_cancelacion',
  ),
  totalGeneral: normalizeNumber(raw.total_general, 'total_general'),
});

const normalizeDonorChartItem = (
  raw: RawDonorChartItem,
): NormalizedDonorChartItem => ({
  donor: normalizeString(raw['eatc-donor']),
  quantity: normalizeNumber(raw.cantidad, 'cantidad'),
  totalKg: normalizeNumber(raw.total_kg, 'total_kg'),
});


const normalizeMapPoint = (raw: RawMapPoint): NormalizedMapPoint => {
  const donationPoint = raw['eatc-pod_name'].trim();
  const city = extractCityFromDonationPoint(donationPoint);
  const latitude = normalizeNumber(raw['eatc-lat'], 'eatc-lat');
  const longitude = normalizeNumber(raw['eatc-lon'], 'eatc-lon');

  return {
    latitude,
    longitude,
    donor: normalizeString(raw['eatc-donor']),
    donationPoint,
    city,
    department: deriveDepartment(city, latitude, longitude),
    quantity: normalizeNumber(raw.cantidad, 'cantidad'),
    totalKg: normalizeNumber(raw.total_kg, 'total_kg'),
  };
};

const normalizeRiskPoint = (raw: RawRiskPoint): NormalizedRiskPoint => {
  const city = extractCityFromDonationPoint(raw.pod_name);
  const probability = normalizeNumber(raw.probabilidad, 'probabilidad');

  return {
    donor: normalizeString(raw.donor),
    donationPoint: raw.pod_name.trim(),
    total: normalizeNumber(raw.total, 'total'),
    cancelled: normalizeNumber(raw.canceladas, 'canceladas'),
    probability,
    latitude: normalizeNumber(raw.lat, 'lat'),
    longitude: normalizeNumber(raw.lon, 'lon'),
    totalKg: normalizeNumber(raw.total_kg, 'total_kg'),
    city,
    department: deriveDepartment(city, raw.lat, raw.lon),
    riskLevel: resolveRiskLevel(probability),
  };
};

const normalizeRiskDonor = (raw: RawRiskDonor): NormalizedRiskDonor => {
  const probability = normalizeNumber(raw.probabilidad, 'probabilidad');

  return {
    donor: normalizeString(raw.donor),
    total: normalizeNumber(raw.total, 'total'),
    cancelled: normalizeNumber(raw.canceladas, 'canceladas'),
    probability,
    totalKg: normalizeNumber(raw.total_kg, 'total_kg'),
    riskLevel: resolveRiskLevel(probability),
  };
};

const normalizeBeneficiary = (
  raw: RawBeneficiary,
  type: BeneficiaryType,
): NormalizedBeneficiary => {
  const latitude = normalizeNumber(raw.lat, 'lat');
  const longitude = normalizeNumber(raw.lon, 'lon');
  const city = extractCityFromDonationPoint(raw.nombre);

  return {
    latitude,
    longitude,
    name: raw.nombre.trim(),
    phone: raw.telefono?.trim() ?? '',
    status: normalizeString(raw.estado),
    type,
    city,
    department: deriveDepartment(city, latitude, longitude),
    riskLevel: mapBeneficiaryStatusToRisk(raw.estado),
  };
};

const mapBeneficiaryStatusToRisk = (status: string): RiskLevel => {
  const normalized = normalizeString(status);

  if (['activo', 'inscrito', 'en_activacion'].includes(normalized)) {
    return 'LOW';
  }

  if (['pasivo', 'persona_natural', 'inactivo'].includes(normalized)) {
    return 'MEDIUM';
  }

  if (['suspendido', 'rechazado'].includes(normalized)) {
    return 'HIGH';
  }

  return 'CRITICAL';
};

/**
 * Aggregates map point records by donation point, summing quantity and totalKg,
 * then returns the top 10 entries ranked by total quantity (descending).
 * The id of each entry is the donationPoint name.
 */
const getTopDonationPoints = (
  rawMapPoints: RawMapPoint[],
  topN = 10,
): NormalizedMapPoint[] => {
  const aggregated = new Map<string, NormalizedMapPoint>();

  for (const raw of rawMapPoints) {
    const normalized = normalizeMapPoint(raw);
    const key = normalized.donationPoint;
    const existing = aggregated.get(key);

    if (existing) {
      existing.quantity += normalized.quantity;
      existing.totalKg += normalized.totalKg;
    } else {
      aggregated.set(key, { ...normalized });
    }
  }

  return [...aggregated.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, topN);
};

export const normalizeDashboardDataset = (
  raw: RawDashboardDataset,
): NormalizedDashboardData => ({
  kpis: normalizeKpis(raw.kpis),
  donorCharts: raw.graficos.donantes.map(normalizeDonorChartItem),
  topDonationPoints: getTopDonationPoints(raw.mapas),
  mapPoints: raw.mapas.map(normalizeMapPoint),
  riskPoints: raw.riesgo.puntos.map(normalizeRiskPoint),
  riskDonors: raw.riesgo.donantes.map(normalizeRiskDonor),
  beneficiaries: [
    ...raw.beneficiarios_tipologias.tipo_1.map((item) =>
      normalizeBeneficiary(item, 'T1'),
    ),
    ...raw.beneficiarios_tipologias.tipo_2.map((item) =>
      normalizeBeneficiary(item, 'T2'),
    ),
    ...raw.beneficiarios_tipologias.tipo_3.map((item) =>
      normalizeBeneficiary(item, 'T3'),
    ),
  ],
});

