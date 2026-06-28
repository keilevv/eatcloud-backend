# EatCloud Backend

Production-ready REST API backend for the EatCloud platform, consumed by the Next.js web application and React Native (Expo) mobile application.

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Package Manager:** pnpm

Additional tooling includes ESLint, Prettier, Husky, lint-staged, Swagger, and Docker.

## Folder Structure

```
eatcloud-backend/
├── src/
│   ├── config/           # Application configuration
│   ├── constants/        # Reusable constants
│   ├── controllers/      # HTTP request handlers
│   ├── database/         # Sequelize setup, migrations, seeders
│   ├── docs/             # OpenAPI / Swagger documentation
│   ├── dto/              # Data transfer objects
│   ├── interfaces/       # Shared interfaces
│   ├── middlewares/      # Express middleware
│   ├── models/           # Sequelize models
│   ├── repositories/     # Data access layer
│   ├── routes/           # Route definitions
│   ├── services/         # Business logic
│   ├── tests/            # Test files
│   ├── types/            # Custom TypeScript types
│   ├── utils/            # Utility modules
│   ├── validators/       # Request validation
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server entry point
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Installation

1. Clone the repository and navigate to the backend directory:

   ```bash
   cd eatcloud-backend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy the environment template and configure your values:

   ```bash
   cp .env.example .env
   ```

## Environment Variables

| Variable           | Description                          |
| ------------------ | ------------------------------------ |
| `PORT`             | Server port (default: `3000`)        |
| `NODE_ENV`         | Environment (`development`, `production`) |
| `DATABASE_HOST`    | PostgreSQL host                      |
| `DATABASE_PORT`    | PostgreSQL port                      |
| `DATABASE_NAME`    | Database name                        |
| `DATABASE_USER`    | Database user                        |
| `DATABASE_PASSWORD`| Database password                    |
| `JWT_SECRET`       | Secret key for JWT signing (**required**) |
| `JWT_EXPIRES_IN`   | JWT expiration duration (default: `7d`)     |

## Running Migrations

Before using authentication endpoints, apply database migrations:

```bash
pnpm db:migrate
```

This creates the `users` table and required indexes. To undo the last migration:

```bash
pnpm db:migrate:undo
```

## Running Locally

1. Ensure PostgreSQL is running and matches your `.env` configuration.

2. Create the database if it does not exist yet:

   ```bash
   createdb -U postgres eatcloud
   ```

   Or with `psql`:

   ```sql
   CREATE DATABASE eatcloud;
   ```

3. Run database migrations:

   ```bash
   pnpm db:migrate
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Verify the health endpoint:

   ```bash
   curl http://localhost:3000/health
   ```

   Expected response:

   ```json
   {
     "status": "ok",
     "uptime": 1.234,
     "timestamp": "2026-06-27T00:00:00.000Z"
   }
   ```

## Authentication Overview

The authentication module provides JWT-based access for the Next.js web app and React Native mobile clients.

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/api/auth/register` | POST | No | Create a new user account |
| `/api/auth/login` | POST | No | Authenticate and receive a JWT |
| `/api/auth/me` | GET | Bearer JWT | Get the current user profile |

### JWT Flow

1. Client sends credentials to `POST /api/auth/login`.
2. Server validates credentials and returns a signed JWT access token.
3. Client includes the token in subsequent requests: `Authorization: Bearer <token>`.
4. The `authenticate` middleware verifies the token and attaches the user to the request.
5. Protected routes (e.g. `GET /api/auth/me`) use the authenticated user context.

The architecture separates token generation (`utils/jwt.ts`) from business logic (`AuthService`), so refresh tokens can be added later without refactoring the service layer.

### How Passwords Are Stored

- Passwords are hashed with **bcrypt** (cost factor **10**) before storage.
- Hashing happens in the service layer via `utils/password.ts` — never in controllers.
- The `password` column is excluded from all default model scopes and API responses.
- Plain-text passwords are never logged or returned.

## Swagger Documentation

Interactive API documentation is available at:

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **OpenAPI JSON:** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

## Testing Authentication

### Example: Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securePass123"
  }'
```

Response (`201`):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Example: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "securePass123"
  }'
```

Response (`200`):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

### Example: Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

Response (`200`):

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Postman Collection

Import the collection from `docs/postman/EatCloud-Auth.postman_collection.json`. It includes **Authentication** and **Dashboard** folders. The login request automatically stores the JWT in the `jwtToken` variable for all protected dashboard requests.

Collection variables:

| Variable | Description |
| -------- | ----------- |
| `baseUrl` | API base URL (default: `http://localhost:3000`) |
| `jwtToken` | Automatically set after a successful login |

## Dashboard Analytics

The dashboard module is the single source of truth for analytics consumed by the web and mobile clients. The frontend never reads `src/formatted.json` directly — all data is exposed through authenticated REST endpoints with normalized DTOs.

### Architecture

```
routes → DashboardController → DashboardService → Aggregator / FilterEngine
                                      ↓
                               DashboardCache (singleton)
                                      ↓
                               DashboardParser / Normalizer
                                      ↓
                               DashboardRepository → formatted.json
```

| Layer | Responsibility |
| ----- | -------------- |
| `DashboardRepository` | Read and deserialize the JSON file |
| `DashboardCache` | In-memory singleton cache (`load`, `refresh`, `clear`, `isLoaded`) |
| `DashboardParser` | Validate raw JSON structure |
| `Normalizer` | Convert raw field names to camelCase domain objects |
| `FilterEngine` | Apply composable query filters |
| `Aggregator` | Compute KPIs, charts, rankings and map datasets |
| `DashboardService` | Orchestrate cache, filtering and aggregation |
| `DashboardController` | HTTP layer only |

### Caching Strategy

- The dataset is loaded **once** on first request (lazy loading).
- Parsed data is stored in a singleton in-memory cache.
- Subsequent requests reuse cached data — the file is never re-read per request.
- `POST /api/dashboard/cache/refresh` reloads the dataset (authenticated).

### Filtering System

All dashboard GET endpoints support optional composable query parameters:

| Parameter | Description |
| --------- | ----------- |
| `donor` | Filter by donor |
| `donationPoint` | Filter by donation point |
| `city` | Filter by city |
| `department` | Filter by department |
| `riskLevel` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `beneficiaryType` | `T1`, `T2`, `T3` |
| `beneficiaryStatus` | e.g. `activo`, `suspendido` |
| `limit` | Positive integer (1–500) for ranked results |

Example:

```bash
curl "http://localhost:3000/api/dashboard/cancellation-analysis?donor=exito&city=CALI&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Available Endpoints

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/api/dashboard/overview` | GET | JWT | KPIs and global summary |
| `/api/dashboard/cancellation-analysis` | GET | JWT | Cancellation charts and rankings |
| `/api/dashboard/predictive-analysis` | GET | JWT | Risk analysis and map datasets |
| `/api/dashboard/beneficiaries` | GET | JWT | Beneficiary visualization |
| `/api/dashboard/ecosystem` | GET | JWT | Full ecosystem and map layers |
| `/api/dashboard/filter-options` | GET | JWT | All available filter values |
| `/api/dashboard/cache/refresh` | POST | JWT | Reload dataset into cache |

### Example: Dashboard Overview

```bash
curl http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer <your-jwt-token>"
```

Response (`200`):

```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "kpis": {
      "totalCancelled": 9854,
      "totalKgCancelled": 168031.17,
      "cancellationProbability": 0.1379,
      "totalGeneral": 71451
    },
    "summary": {
      "totalDonors": 19,
      "totalDonationPoints": 575,
      "totalBeneficiaries": 2948,
      "averageCancellationProbability": 0.1379,
      "filteredRecords": 1165
    }
  }
}
```

## Running with Docker

Start the backend and PostgreSQL together:

```bash
docker compose up --build
```

> **Note:** Your user account must have permission to access the Docker daemon (e.g. membership in the `docker` group).

The backend connects to PostgreSQL automatically via the Docker network. PostgreSQL data is persisted in a named volume.

## Available Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start development server with hot reload |
| `pnpm build`        | Compile TypeScript to `dist/`            |
| `pnpm start`        | Run compiled production server           |
| `pnpm lint`         | Run ESLint                               |
| `pnpm lint:fix`     | Run ESLint with auto-fix                 |
| `pnpm format`       | Format code with Prettier                |
| `pnpm test`         | Run tests                                |
| `pnpm db:migrate`   | Run database migrations                  |
| `pnpm db:migrate:undo` | Undo last migration                   |
| `pnpm db:seed`      | Run database seeders                     |
| `pnpm db:seed:undo` | Undo all seeders                         |

## Development Workflow

1. Create a feature branch from `main`.
2. Implement changes following Clean Architecture:
   - Business logic belongs in **services**
   - Database access belongs in **repositories**
   - Controllers should only handle HTTP concerns
3. Run linting and formatting before committing:

   ```bash
   pnpm lint:fix
   pnpm format
   ```

4. Husky runs ESLint and Prettier on staged files via lint-staged during pre-commit.

5. Build and test before opening a pull request:

   ```bash
   pnpm build
   pnpm test
   ```

## Architecture Principles

- **Clean Architecture:** Separation of concerns across layers (routes → controllers → services → repositories).
- **Environment-based configuration:** No hardcoded secrets or connection strings.
- **Centralized error handling:** All API errors follow a consistent response format.
- **Migration-ready database:** Sequelize CLI configured for migrations and seeders.

## License

ISC
