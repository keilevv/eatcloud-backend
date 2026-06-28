import { RawDashboardDataset } from '../interfaces/dashboard.interface';
import { AppError } from './app-error';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { normalizeDashboardDataset } from './Normalizer';
import { NormalizedDashboardData } from '../interfaces/dashboard.interface';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const assertDashboardShape = (raw: unknown): RawDashboardDataset => {
  if (!isObject(raw)) {
    throw new AppError(
      ERROR_MESSAGES.DATASET_MALFORMED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  const requiredKeys = [
    'kpis',
    'graficos',
    'mapas',
    'riesgo',
    'beneficiarios_tipologias',
  ];

  for (const key of requiredKeys) {
    if (!(key in raw)) {
      throw new AppError(
        ERROR_MESSAGES.DATASET_MALFORMED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  return raw as unknown as RawDashboardDataset;
};

export class DashboardParser {
  parse(raw: unknown): NormalizedDashboardData {
    try {
      const dataset = assertDashboardShape(raw);
      return normalizeDashboardDataset(dataset);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ERROR_MESSAGES.DATASET_PARSE_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const dashboardParser = new DashboardParser();
