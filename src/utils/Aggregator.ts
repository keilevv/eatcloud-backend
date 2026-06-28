import {
  DashboardFilters,
  NormalizedDashboardData,
  NormalizedMapPoint,
  NormalizedRiskDonor,
  NormalizedRiskPoint,
} from '../interfaces/dashboard.interface';
import { ChartSeriesDto } from '../dto/Chart.dto';
import {
  BeneficiaryResponseDto,
  FilterOptionsDto,
  KpiDto,
  MapLayerDto,
  OverviewResponseDto,
  RankingDto,
  RiskPointDto,
  ScatterPointDto,
} from '../dto/Dashboard.dto';
import { filterEngine } from './FilterEngine';

const DEFAULT_TOP_LIMIT = 10;

const round = (value: number, decimals = 2): number =>
  Number(value.toFixed(decimals));

const toKpiDto = (data: NormalizedDashboardData): KpiDto => ({
  totalCancelled: data.kpis.totalCancelled,
  totalKgCancelled: round(data.kpis.totalKgCancelled),
  cancellationProbability: round(data.kpis.cancellationProbability, 4),
  totalGeneral: data.kpis.totalGeneral,
});

const toRiskPointDto = (point: NormalizedRiskPoint): RiskPointDto => ({
  donor: point.donor,
  donationPoint: point.donationPoint,
  total: point.total,
  cancelled: point.cancelled,
  probability: round(point.probability, 4),
  totalKg: round(point.totalKg),
  latitude: point.latitude,
  longitude: point.longitude,
  city: point.city,
  department: point.department,
  riskLevel: point.riskLevel,
});

const toRiskDonorDto = (donor: NormalizedRiskDonor): RiskPointDto => ({
  donor: donor.donor,
  donationPoint: '',
  total: donor.total,
  cancelled: donor.cancelled,
  probability: round(donor.probability, 4),
  totalKg: round(donor.totalKg),
  latitude: 0,
  longitude: 0,
  city: '',
  department: '',
  riskLevel: donor.riskLevel,
});

const toChartSeries = (
  label: string,
  value: number,
  secondaryValue?: number,
): ChartSeriesDto => ({
  label,
  value: round(value),
  secondaryValue:
    secondaryValue !== undefined ? round(secondaryValue) : undefined,
});

const aggregateDonationPoints = (
  mapPoints: NormalizedMapPoint[],
): Map<string, { quantity: number; totalKg: number }> => {
  const aggregated = new Map<string, { quantity: number; totalKg: number }>();

  for (const point of mapPoints) {
    const current = aggregated.get(point.donationPoint) ?? {
      quantity: 0,
      totalKg: 0,
    };

    aggregated.set(point.donationPoint, {
      quantity: current.quantity + point.quantity,
      totalKg: current.totalKg + point.totalKg,
    });
  }

  return aggregated;
};

const buildRankings = (
  entries: Array<{ label: string; quantity: number; totalKg: number }>,
  limit: number,
): RankingDto[] =>
  [...entries]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      label: entry.label,
      quantity: round(entry.quantity),
      totalKg: round(entry.totalKg),
    }));

export class Aggregator {
  buildOverview(
    data: NormalizedDashboardData,
    filters: DashboardFilters,
  ): OverviewResponseDto {
    const filtered = filterEngine.filterDataset(data, filters);
    const uniqueDonors = new Set(filtered.mapPoints.map((item) => item.donor));
    const uniquePoints = new Set(
      filtered.mapPoints.map((item) => item.donationPoint),
    );

    return {
      kpis: toKpiDto(data),
      summary: {
        totalDonors: uniqueDonors.size,
        totalDonationPoints: uniquePoints.size,
        totalBeneficiaries: filtered.beneficiaries.length,
        averageCancellationProbability: round(
          data.kpis.cancellationProbability,
          4,
        ),
        filteredRecords: filtered.mapPoints.length,
      },
    };
  }

  buildCancellationAnalysis(
    data: NormalizedDashboardData,
    filters: DashboardFilters,
  ) {
    const filtered = filterEngine.filterDataset(data, filters);
    const donationPointAggregation = aggregateDonationPoints(
      filtered.mapPoints,
    );

    const donors = filtered.donorCharts.map((item) =>
      toChartSeries(item.donor, item.quantity, item.totalKg),
    );

    const donationPoints = [...donationPointAggregation.entries()].map(
      ([label, values]) =>
        toChartSeries(label, values.quantity, values.totalKg),
    );

    const cancellationVolume = filtered.riskPoints.map((item) =>
      toChartSeries(item.donationPoint, item.totalKg, item.cancelled),
    );

    const cancellationCount = filtered.riskPoints.map((item) =>
      toChartSeries(item.donationPoint, item.cancelled, item.total),
    );

    const topDonors = buildRankings(
      filtered.donorCharts.map((item) => ({
        label: item.donor,
        quantity: item.quantity,
        totalKg: item.totalKg,
      })),
      filters.limit ?? DEFAULT_TOP_LIMIT,
    );

    const topDonationPoints = buildRankings(
      [...donationPointAggregation.entries()].map(([label, values]) => ({
        label,
        quantity: values.quantity,
        totalKg: values.totalKg,
      })),
      filters.limit ?? DEFAULT_TOP_LIMIT,
    );

    return {
      donors,
      donationPoints,
      cancellationVolume,
      cancellationCount,
      topDonors,
      topDonationPoints,
    };
  }

  buildPredictiveAnalysis(
    data: NormalizedDashboardData,
    filters: DashboardFilters,
  ) {
    const filtered = filterEngine.filterDataset(data, filters);
    const sortedPoints = [...filtered.riskPoints].sort(
      (a, b) => b.probability - a.probability,
    );
    const sortedDonors = [...filtered.riskDonors].sort(
      (a, b) => b.probability - a.probability,
    );

    const excellentPoints = filtered.riskPoints
      .filter((point) => point.probability === 0)
      .slice(0, filters.limit ?? DEFAULT_TOP_LIMIT)
      .map(toRiskPointDto);

    const scatterPlot: ScatterPointDto[] = filtered.riskPoints.map((point) => ({
      label: point.donationPoint,
      x: round(point.totalKg),
      y: round(point.probability, 4),
      size: point.cancelled,
      riskLevel: point.riskLevel,
    }));

    const semaphoreMap: MapLayerDto[] = filtered.riskPoints.map((point) => ({
      id: `${point.donor}-${point.donationPoint}`,
      label: point.donationPoint,
      latitude: point.latitude,
      longitude: point.longitude,
      value: round(point.probability, 4),
      riskLevel: point.riskLevel,
      category: 'risk-point',
    }));

    return {
      highestRiskPoint: sortedPoints[0]
        ? toRiskPointDto(sortedPoints[0])
        : null,
      highestRiskDonor: sortedDonors[0]
        ? toRiskDonorDto(sortedDonors[0])
        : null,
      excellentPoints,
      topRiskDonors: sortedDonors
        .slice(0, filters.limit ?? DEFAULT_TOP_LIMIT)
        .map(toRiskDonorDto),
      topRiskDonationPoints: sortedPoints
        .slice(0, filters.limit ?? DEFAULT_TOP_LIMIT)
        .map(toRiskPointDto),
      scatterPlot,
      semaphoreMap,
    };
  }

  buildBeneficiaries(data: NormalizedDashboardData, filters: DashboardFilters) {
    const beneficiaries = filterEngine.filterBeneficiaries(
      data.beneficiaries,
      filters,
    );

    const statusCounts = beneficiaries.reduce<Record<string, number>>(
      (accumulator, beneficiary) => {
        accumulator[beneficiary.status] =
          (accumulator[beneficiary.status] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    const typeCounts = beneficiaries.reduce<Record<string, number>>(
      (accumulator, beneficiary) => {
        accumulator[beneficiary.type] =
          (accumulator[beneficiary.type] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    const riskCounts = beneficiaries.reduce<Record<string, number>>(
      (accumulator, beneficiary) => {
        accumulator[beneficiary.riskLevel] =
          (accumulator[beneficiary.riskLevel] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    const locations: BeneficiaryResponseDto[] = beneficiaries.map(
      (beneficiary) => ({
        name: beneficiary.name,
        phone: beneficiary.phone,
        status: beneficiary.status,
        type: beneficiary.type,
        latitude: beneficiary.latitude,
        longitude: beneficiary.longitude,
        city: beneficiary.city,
        department: beneficiary.department,
        riskLevel: beneficiary.riskLevel,
      }),
    );

    return {
      visualization: {
        totalBeneficiaries: beneficiaries.length,
        byType: typeCounts,
        byStatus: statusCounts,
      },
      locations,
      operationalStatus: statusCounts,
      riskIndicators: riskCounts,
    };
  }

  buildEcosystem(data: NormalizedDashboardData, filters: DashboardFilters) {
    const filtered = filterEngine.filterDataset(data, filters);
    const donationPoints = [
      ...aggregateDonationPoints(filtered.mapPoints).entries(),
    ].map(([label, values]) => ({
      donationPoint: label,
      quantity: round(values.quantity),
      totalKg: round(values.totalKg),
    }));

    const beneficiaries = filtered.beneficiaries.map((beneficiary) => ({
      name: beneficiary.name,
      phone: beneficiary.phone,
      status: beneficiary.status,
      type: beneficiary.type,
      latitude: beneficiary.latitude,
      longitude: beneficiary.longitude,
      city: beneficiary.city,
      department: beneficiary.department,
      riskLevel: beneficiary.riskLevel,
    }));

    const typologies = filtered.beneficiaries.reduce<Record<string, number>>(
      (accumulator, beneficiary) => {
        accumulator[beneficiary.type] =
          (accumulator[beneficiary.type] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    const operationalStates = filtered.beneficiaries.reduce<
      Record<string, number>
    >((accumulator, beneficiary) => {
      accumulator[beneficiary.status] =
        (accumulator[beneficiary.status] ?? 0) + 1;
      return accumulator;
    }, {});

    const mapLayers: MapLayerDto[] = [
      ...filtered.mapPoints.map((point) => ({
        id: `pod-${point.donationPoint}`,
        label: point.donationPoint,
        latitude: point.latitude,
        longitude: point.longitude,
        value: round(point.totalKg),
        riskLevel: 'LOW' as const,
        category: 'donation-point',
      })),
      ...filtered.beneficiaries.map((beneficiary) => ({
        id: `beneficiary-${beneficiary.name}`,
        label: beneficiary.name,
        latitude: beneficiary.latitude,
        longitude: beneficiary.longitude,
        value: 1,
        riskLevel: beneficiary.riskLevel,
        category: 'beneficiary',
      })),
    ];

    return {
      donationPoints,
      beneficiaries,
      typologies,
      operationalStates,
      mapLayers,
    };
  }

  buildFilterOptions(data: NormalizedDashboardData): FilterOptionsDto {
    return {
      donors: [...new Set(data.donorCharts.map((item) => item.donor))].sort(),
      donationPoints: [
        ...new Set(data.mapPoints.map((item) => item.donationPoint)),
      ].sort(),
      cities: [...new Set(data.mapPoints.map((item) => item.city))].sort(),
      departments: [
        ...new Set(data.mapPoints.map((item) => item.department)),
      ].sort(),
      beneficiaryTypes: ['T1', 'T2', 'T3'],
      beneficiaryStatuses: [
        ...new Set(data.beneficiaries.map((item) => item.status)),
      ].sort(),
      riskLevels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    };
  }
}

export const aggregator = new Aggregator();
