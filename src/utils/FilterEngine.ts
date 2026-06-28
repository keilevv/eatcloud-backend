import {
  DashboardFilters,
  NormalizedBeneficiary,
  NormalizedDashboardData,
  NormalizedDonorChartItem,
  NormalizedMapPoint,
  NormalizedRiskDonor,
  NormalizedRiskPoint,
} from '../interfaces/dashboard.interface';

const matchesText = (value: string, filter?: string): boolean => {
  if (!filter) {
    return true;
  }

  return value.toLowerCase().includes(filter.toLowerCase());
};

const applyLimit = <T>(items: T[], limit?: number): T[] => {
  if (!limit) {
    return items;
  }

  return items.slice(0, limit);
};

export class FilterEngine {
  filterDonorCharts(
    items: NormalizedDonorChartItem[],
    filters: DashboardFilters,
  ): NormalizedDonorChartItem[] {
    return applyLimit(
      items.filter((item) => matchesText(item.donor, filters.donor)),
      filters.limit,
    );
  }

  filterMapPoints(
    items: NormalizedMapPoint[],
    filters: DashboardFilters,
  ): NormalizedMapPoint[] {
    return applyLimit(
      items.filter(
        (item) =>
          matchesText(item.donor, filters.donor) &&
          matchesText(item.donationPoint, filters.donationPoint) &&
          matchesText(item.city, filters.city) &&
          matchesText(item.department, filters.department),
      ),
      filters.limit,
    );
  }

  filterRiskPoints(
    items: NormalizedRiskPoint[],
    filters: DashboardFilters,
  ): NormalizedRiskPoint[] {
    return applyLimit(
      items.filter(
        (item) =>
          matchesText(item.donor, filters.donor) &&
          matchesText(item.donationPoint, filters.donationPoint) &&
          matchesText(item.city, filters.city) &&
          matchesText(item.department, filters.department) &&
          (!filters.riskLevel || item.riskLevel === filters.riskLevel),
      ),
      filters.limit,
    );
  }

  filterRiskDonors(
    items: NormalizedRiskDonor[],
    filters: DashboardFilters,
  ): NormalizedRiskDonor[] {
    return applyLimit(
      items.filter(
        (item) =>
          matchesText(item.donor, filters.donor) &&
          (!filters.riskLevel || item.riskLevel === filters.riskLevel),
      ),
      filters.limit,
    );
  }

  filterBeneficiaries(
    items: NormalizedBeneficiary[],
    filters: DashboardFilters,
  ): NormalizedBeneficiary[] {
    return applyLimit(
      items.filter(
        (item) =>
          matchesText(item.city, filters.city) &&
          matchesText(item.department, filters.department) &&
          (!filters.beneficiaryType || item.type === filters.beneficiaryType) &&
          (!filters.beneficiaryStatus ||
            item.status === filters.beneficiaryStatus.toLowerCase()) &&
          (!filters.riskLevel || item.riskLevel === filters.riskLevel),
      ),
      filters.limit,
    );
  }

  filterDataset(
    data: NormalizedDashboardData,
    filters: DashboardFilters,
  ): {
    donorCharts: NormalizedDonorChartItem[];
    mapPoints: NormalizedMapPoint[];
    riskPoints: NormalizedRiskPoint[];
    riskDonors: NormalizedRiskDonor[];
    beneficiaries: NormalizedBeneficiary[];
  } {
    return {
      donorCharts: this.filterDonorCharts(data.donorCharts, filters),
      mapPoints: this.filterMapPoints(data.mapPoints, filters),
      riskPoints: this.filterRiskPoints(data.riskPoints, filters),
      riskDonors: this.filterRiskDonors(data.riskDonors, filters),
      beneficiaries: this.filterBeneficiaries(data.beneficiaries, filters),
    };
  }
}

export const filterEngine = new FilterEngine();
