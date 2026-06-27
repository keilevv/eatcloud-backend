import { config } from 'dotenv';
import { resolve } from 'path';

let isLoaded = false;

export const loadEnvironment = (): void => {
  if (isLoaded) {
    return;
  }

  config({ path: resolve(process.cwd(), '.env') });
  isLoaded = true;
};
