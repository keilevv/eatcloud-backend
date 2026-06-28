import { NormalizedDashboardData } from '../interfaces/dashboard.interface';
import { dashboardRepository } from '../repositories/DashboardRepository';
import { dashboardParser } from './DashboardParser';

export class DashboardCache {
  private data: NormalizedDashboardData | null = null;
  private loading: Promise<NormalizedDashboardData> | null = null;

  isLoaded(): boolean {
    return this.data !== null;
  }

  async load(): Promise<NormalizedDashboardData> {
    if (this.data) {
      return this.data;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.loadFromSource();
    this.data = await this.loading;
    this.loading = null;

    return this.data;
  }

  async refresh(): Promise<NormalizedDashboardData> {
    this.clear();
    return this.load();
  }

  clear(): void {
    this.data = null;
    this.loading = null;
  }

  private async loadFromSource(): Promise<NormalizedDashboardData> {
    const raw = await dashboardRepository.readRaw();
    return dashboardParser.parse(raw);
  }
}

export const dashboardCache = new DashboardCache();
