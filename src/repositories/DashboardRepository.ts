import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { DASHBOARD_DATASET_PATH } from '../constants';
import { AppError } from '../utils/app-error';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export class DashboardRepository {
  constructor(private readonly filePath: string) {}

  async readRaw(): Promise<unknown> {
    try {
      const content = await readFile(this.filePath, 'utf-8');
      return JSON.parse(content) as unknown;
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as Error & { code?: string }).code === 'ENOENT'
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATASET_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      if (error instanceof SyntaxError) {
        throw new AppError(
          ERROR_MESSAGES.DATASET_MALFORMED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }

      throw error;
    }
  }
}

export const dashboardRepository = new DashboardRepository(
  resolve(process.cwd(), DASHBOARD_DATASET_PATH),
);
