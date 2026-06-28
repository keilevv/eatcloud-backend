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
  DATASET_NOT_FOUND: 'Dashboard dataset not found',
  DATASET_MALFORMED: 'Dashboard dataset is malformed',
  DATASET_PARSE_ERROR: 'Failed to parse dashboard dataset',
} as const;

export const SUCCESS_MESSAGES = {
  HEALTH_CHECK: 'Service is healthy',
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  DASHBOARD_OVERVIEW: 'Dashboard overview retrieved successfully',
  DASHBOARD_CANCELLATION_ANALYSIS:
    'Cancellation analysis retrieved successfully',
  DASHBOARD_PREDICTIVE_ANALYSIS: 'Predictive analysis retrieved successfully',
  DASHBOARD_BENEFICIARIES: 'Beneficiary analysis retrieved successfully',
  DASHBOARD_ECOSYSTEM: 'Ecosystem data retrieved successfully',
  DASHBOARD_FILTER_OPTIONS: 'Filter options retrieved successfully',
  DASHBOARD_CACHE_REFRESHED: 'Dashboard cache refreshed successfully',
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

export const DASHBOARD_ROUTES = {
  BASE: '/dashboard',
  OVERVIEW: '/overview',
  CANCELLATION_ANALYSIS: '/cancellation-analysis',
  PREDICTIVE_ANALYSIS: '/predictive-analysis',
  BENEFICIARIES: '/beneficiaries',
  ECOSYSTEM: '/ecosystem',
  FILTER_OPTIONS: '/filter-options',
  CACHE_REFRESH: '/cache/refresh',
} as const;

export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const BENEFICIARY_TYPES = ['T1', 'T2', 'T3'] as const;

export const BENEFICIARY_STATUSES = [
  'activo',
  'en_activacion',
  'expulsado',
  'inactivo',
  'inscrito',
  'pasivo',
  'persona_natural',
  'rechazado',
  'suspendido',
] as const;

export const DASHBOARD_DATASET_PATH = 'src/formatted.json';
