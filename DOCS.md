# Perdiemin challenge Documentation

Architecture

- **Frontend**: Next.js application using App Router
- **Backend**: Node.js + TypeScript API with PostgreSQL and Redis

## Table of Contents

1. [Frontend Documentation](#frontend-documentation)
2. [Backend Documentation](#backend-documentation)
3. [Docker Setup](#docker-setup)
4. [Development](#development)

## Frontend Documentation

### Pages Implementation

The frontend application includes these main pages:

- **Home Page** (`app/page.tsx`): Displays store-specific information with dynamic theming
- **Login Page** (`app/login/page.tsx`): Authentication for existing users
- **Signup Page** (`app/signup/page.tsx`): User registration with store-specific accounts
- **Profile Page** (`app/profile/page.tsx`): Protected page showing user information

### State Management

The application uses React Context for global state management:

- **Store Context** (`lib/contexts/StoreContext.tsx`): Manages store information (name, theme, slug) across the app
- Provides loading and error states
- Automatically updates based on current subdomain

### API Integration

API helper functions in `web/lib/api.ts` provide:

- Subdomain handling for multi-tenant routing
- Authentication functions (signup, login, getProfile, logout)
- Store information fetching
- JWT token management in localStorage
- Error handling for network requests

### Multi-Tenant Features

- Dynamic subdomain detection (a.localhost:3000, b.localhost:3000, etc.)
- Store-specific theming with color schemes
- Isolated user accounts per store
- Subdomain-aware authentication

## Backend Documentation

### Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL for persistent storage
- **Cache**: Redis for performance optimization
- **Authentication**: JWT-based with 24-hour expiration

### Data Models

- **Store**: Contains store information (id, name, slug, theme)
- **User**: Contains user information with store association (id, email, password, store_id)

### Multi-Tenancy Implementation

- Subdomain-based store routing (middleware extracts store from subdomain)
- Store-specific user isolation (users tied to specific stores)
- Cross-store access prevention through authentication middleware
- Store-specific database queries with store_id filters

### API Endpoints

- `GET /`: Get current store information
- `POST /signup`: Create user in current store
- `POST /login`: Authenticate user and return JWT token
- `GET /profile`: Get authenticated user profile (requires auth)

### Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token validation with store verification
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- Environment-based secrets management

## Docker Setup

### Development Environment

The application uses Docker Compose for development with 4 services:

- PostgreSQL on port 5433 (host) → 5432 (container)
- Redis on port 6380 (host) → 6379 (container)
- Backend API on port 4001 (host) → 4000 (container)
- Frontend on port 3001 (host) → 3000 (container)

### Running the Application

```bash
# Build and start all services
docker compose up --build -d

# Run database migrations
docker compose exec backend pnpm run db:migrate

# Stop services
docker compose down

# Check running services
docker compose ps
```

### Access Points

- Frontend: http://localhost:3001
- Backend: http://localhost:4001
- PostgreSQL: localhost:5433
- Redis: localhost:6380

## Development

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)

### Local Development

1. Start Docker services: `docker compose up --build -d`
2. Run database migrations: `docker compose exec backend pnpm run db:migrate`
3. Access frontend at http://localhost:3001
4. Access backend at http://localhost:4001

### Environment Variables

- Backend: Check `.env` file in server directory
- Frontend: Check `.env` file in web directory

## Testing the Multi-Tenant Feature

1. Visit http://a.localhost:3001 to access Store A
2. Visit http://b.localhost:3001 to access Store B
3. Users registered in Store A cannot access data from Store B
4. Each store has its own theme and user base

