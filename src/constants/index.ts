export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
  NOT_FOUND: 'Resource not found',
  ROUTE_NOT_FOUND: 'Route not found',
  VALIDATION_FAILED: 'Validation failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  UNAUTHORIZED: 'Authentication required',
  INVALID_TOKEN: 'Invalid or malformed token',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_MISSING: 'Authentication token is missing',
  USER_NOT_FOUND: 'User not found',
  JWT_SECRET_MISSING: 'JWT secret is not configured',
  DATABASE_ERROR: 'A database error occurred',
} as const;

export const SUCCESS_MESSAGES = {
  HEALTH_CHECK: 'Service is healthy',
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
} as const;

export const MORGAN_FORMAT = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'combined',
} as const;

export const BCRYPT_SALT_ROUNDS = 10;

export const AUTH_HEADER_PREFIX = 'Bearer';

export const SWAGGER_PATH = '/api-docs';

export const API_PREFIX = '/api';

export const AUTH_ROUTES = {
  BASE: '/auth',
  REGISTER: '/register',
  LOGIN: '/login',
  ME: '/me',
} as const;
