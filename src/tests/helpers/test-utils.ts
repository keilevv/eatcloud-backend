import { randomUUID } from 'crypto';

export interface TestUserInput {
  name: string;
  email: string;
  password: string;
}

export const createTestUserInput = (
  overrides: Partial<TestUserInput> = {},
): TestUserInput => ({
  name: 'Jane Doe',
  email: `user-${randomUUID()}@example.com`,
  password: 'securePass123',
  ...overrides,
});
