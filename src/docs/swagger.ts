import swaggerJsdoc from 'swagger-jsdoc';
import { appConfig } from '../config';
import { SWAGGER_PATH } from '../constants';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EatCloud API',
    version: '1.0.0',
    description:
      'REST API for the EatCloud platform. Authentication and dashboard analytics endpoints.',
  },
  servers: [
    {
      url: `http://localhost:${appConfig.port}`,
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Enter JWT access token obtained from POST /api/auth/login',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'Jane Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 128,
            example: 'securePass123',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com',
          },
          password: {
            type: 'string',
            example: 'securePass123',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          name: {
            type: 'string',
            example: 'Jane Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com',
          },
        },
      },
      RegisterSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'User registered successfully',
          },
          data: { $ref: '#/components/schemas/User' },
        },
      },
      LoginSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              user: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
      MeSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: '#/components/schemas/User' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email format' },
              },
            },
          },
        },
      },
    },
    parameters: {
      DonorFilter: {
        in: 'query',
        name: 'donor',
        schema: { type: 'string', example: 'exito' },
        description: 'Filter by donor name',
      },
      DonationPointFilter: {
        in: 'query',
        name: 'donationPoint',
        schema: { type: 'string', example: 'EXITO IPIALES' },
        description: 'Filter by donation point name',
      },
      CityFilter: {
        in: 'query',
        name: 'city',
        schema: { type: 'string', example: 'CALI' },
        description: 'Filter by city',
      },
      DepartmentFilter: {
        in: 'query',
        name: 'department',
        schema: { type: 'string', example: 'Valle del Cauca' },
        description: 'Filter by department',
      },
      RiskLevelFilter: {
        in: 'query',
        name: 'riskLevel',
        schema: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
          example: 'HIGH',
        },
        description: 'Filter by risk level',
      },
      BeneficiaryTypeFilter: {
        in: 'query',
        name: 'beneficiaryType',
        schema: { type: 'string', enum: ['T1', 'T2', 'T3'], example: 'T1' },
        description: 'Filter by beneficiary type',
      },
      BeneficiaryStatusFilter: {
        in: 'query',
        name: 'beneficiaryStatus',
        schema: { type: 'string', example: 'activo' },
        description: 'Filter by beneficiary status',
      },
      LimitFilter: {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', minimum: 1, maximum: 500, example: 10 },
        description: 'Limit the number of ranked or listed results',
      },
    },
  },
};

const swaggerOptions: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/auth.routes.ts',
    './src/routes/dashboard.routes.ts',
    './src/routes/health.routes.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { SWAGGER_PATH };
