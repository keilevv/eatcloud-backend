# EatCloud Backend

Production-ready REST API backend for the EatCloud platform, consumed by the Next.js web application and React Native (Expo) mobile application.

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Package Manager:** pnpm

Additional tooling includes ESLint, Prettier, Husky, lint-staged, and Docker.

## Folder Structure

```
eatcloud-backend/
├── src/
│   ├── config/           # Application configuration
│   ├── constants/        # Reusable constants
│   ├── controllers/      # HTTP request handlers
│   ├── database/         # Sequelize setup, migrations, seeders
│   ├── docs/             # API documentation (future)
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
| `JWT_SECRET`       | Secret key for JWT signing           |
| `JWT_EXPIRES_IN`   | JWT expiration duration              |

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

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Verify the health endpoint:

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
