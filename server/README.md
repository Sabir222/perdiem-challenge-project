# Perdiemin Backend Documentation

## Architecture

The backend follows a layered architecture pattern:

```
┌─────────────────┐
│   API Routes    │  HTTP handlers
├─────────────────┤
│   Middleware    │  Subdomain extraction, auth, validation
├─────────────────┤
│   Services      │  Business logic layer
├─────────────────┤
│   Database/Cache│  PostgreSQL + Redis
└─────────────────┘
```

### Core Components

- **Express**: HTTP server framework
- **PostgreSQL**: Primary database for persistent storage
- **Redis**: Caching layer for improved performance
- **JWT**: Authentication token management
- **bcrypt**: Password hashing
- **helmet**: Security headers for HTTP responses

## Project Structure

```
server/
├── src/
│   ├── index.ts                 # Main application entry point
│   ├── models.ts                # TypeScript interfaces for Store and User
│   ├── middleware.ts            # Subdomain extraction middleware
│   ├── auth.ts                  # JWT authentication middleware
│   ├── services.ts              # Business logic layer
│   ├── validation/              # Request validation schemas and middleware
│   │   ├── index.ts             # Export file for validation utilities
│   │   ├── middleware.ts        # Generic validation middleware
│   │   ├── login.ts             # Login request validation schema
│   │   └── signup.ts            # Signup request validation schema
│   ├── utils/
│   │   └── auth.ts              # JWT utility functions
│   ├── db/
│   │   ├── connection.ts        # PostgreSQL connection pool
│   │   └── migrate.ts           # Database migration script
│   ├── redis/
│   │   └── client.ts            # Redis connection client
│   └── routes/
│       └── store.ts             # API route handlers
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables
└── tsconfig.json                # TypeScript configuration
```

## Data Models

### Store Model

```typescript
interface Store {
  id: string; // UUID primary key
  name: string; // Store name (e.g., "Store A")
  slug: string; // Subdomain identifier (e.g., "a")
  welcome_message?: string; // Optional welcome message
  theme: string; // CSS theme (e.g., hex color codes)
  created_at: Date; // Creation timestamp
  updated_at: Date; // Last update timestamp
}
```

### User Model

```typescript
interface User {
  id: string; // UUID primary key
  email: string; // User email (unique per store)
  password: string; // Hashed password
  store_id: string; // Foreign key to Store
  created_at: Date; // Creation timestamp
  updated_at: Date; // Last update timestamp
}
```

## Multi-Tenancy Implementation

### Subdomain Routing

The system extracts store information from the subdomain:

1. Request comes in: `a.localhost:4000`
2. Middleware extracts subdomain: "a"
3. Store is fetched from cache or database
4. Store information is attached to request object (`req.currentStore`)

### Data Isolation

- Each user belongs to exactly one store through the `store_id` foreign key
- All operations are restricted to the current store context
- Authentication middleware verifies that users belong to the current store
- SQL queries always include store-specific filters

### Relationship Structure

```
┌─────────┐    ┌─────────┐
│  Store  │────│  User   │
│ (id)    │    │(store_id)│
└─────────┘    └─────────┘
```

## Authentication System

### JWT Token Structure

Tokens contain both `userId` and `storeId` for proper isolation:

```typescript
interface TokenPayload {
  userId: string;
  storeId: string;
}
```

### Token Lifecycle

1. **Generation**: On signup/login with `generateToken(userId, storeId)`
2. **Expiration**: 24-hour lifetime
3. **Verification**: On protected endpoints to validate user and store
4. **Validation**: Ensures user belongs to the current store context

### Authentication Flow

1. Client sends token in `Authorization: Bearer <token>` header
2. `authenticateUser` middleware validates token
3. System verifies the token's `storeId` matches current store
4. User information is attached to request (`req.userId`, `req.storeId`)
5. Route handler processes request with authenticated context

## Database Schema

### Stores Table

```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  welcome_message TEXT,
  theme TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Default Stores Created

```sql
INSERT INTO stores (name, slug, welcome_message, theme)
VALUES
  ('Store A', 'a', 'Welcome to Store A', '#3b82f6'),
  ('Store B', 'b', 'Welcome to Store B', '#ef4444'),
  ('Store C', 'c', 'Welcome to Store C', '#10b981');
```

## API Endpoints

### Public Endpoints

#### `GET /` - Get Store Information

**Description**: Returns information about the current store based on subdomain
**Headers**: Host header specifying subdomain
**Response**:

```json
{
  "id": "uuid-string",
  "name": "Store A",
  "slug": "a",
  "welcome_message": "Welcome to Store A"
}
```

**Errors**: 404 if store not found

#### `POST /signup` - Create User

**Description**: Creates a new user in the current store
**Headers**: Host header specifying subdomain
**Validation**: Uses Zod schema for input validation
**Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:

```json
{
  "message": "User created successfully",
  "token": "jwt-token-string",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "store_id": "store-uuid"
  }
}
```

**Validation Errors**: 
- Email must be valid email format
- Password must be at least 8 characters
- Password must contain at least one number
- Password must contain at least one uppercase letter
- Password must contain at least one symbol

**Other Errors**: 404 (store not found), 409 (email exists)

#### `POST /login` - Authenticate User

**Description**: Authenticates user and returns JWT token
**Headers**: Host header specifying subdomain
**Validation**: Uses Zod schema for input validation
**Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:

```json
{
  "message": "Login successful",
  "token": "jwt-token-string",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "store_id": "store-uuid"
  }
}
```

**Validation Errors**: 
- Email must be valid email format
- Password must be at least 8 characters

**Other Errors**: 401 (invalid credentials), 404 (store not found)

### Protected Endpoints

#### `GET /profile` - Get User Profile

**Description**: Returns authenticated user's profile information
**Headers**: Authorization: Bearer <token>
**Response**:

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "store_id": "store-uuid"
}
```

**Errors**: 401 (unauthorized), 404 (user not found)

## Caching Strategy

### Redis Implementation

- **Client**: Redis client connects on application startup
- **Connection**: Configurable via `REDIS_URL` environment variable
- **Events**: Error and connection logging

### Store Caching

- **Key Pattern**: `store:<slug>` (e.g., `store:a`)
- **TTL**: 1 hour (3600 seconds)
- **Cache-Aside Pattern**:
  1. Check Redis cache first
  2. If not found, query database
  3. Store result in Redis for subsequent requests

### Cache Operations

- **Read**: Before database query, check Redis
- **Write**: After database insert/update, update cache
- **Invalidation**: Automatically handled by TTL

## Security Measures

### Password Security

- **Hashing Algorithm**: bcrypt with 10 rounds
- **Storage**: Only hashed passwords stored in database
- **Generation**: Performed during user creation and login verification

### Input Validation

- **Validation Library**: Zod for schema validation
- **Validation Middleware**: Generic middleware for request validation
- **Signup Validation**: 
  - Email format validation
  - Password minimum 8 characters
  - Password must contain at least one number
  - Password must contain at least one uppercase letter
  - Password must contain at least one symbol
- **Login Validation**: 
  - Email format validation
  - Password minimum 8 characters

### Authentication Security

- **Token Expiration**: 24-hour lifetime to limit exposure
- **Store Verification**: Ensures tokens match current store context
- **Error Handling**: Generic error messages to prevent information leakage

### Data Protection

- **Foreign Key Constraints**: Maintain referential integrity
- **Cascade Deletes**: Automatic cleanup of dependent records
- **Parameterized Queries**: Prevent SQL injection attacks
- **Cross-Store Isolation**: Multiple verification layers to prevent cross-store access

### Environment Security

- **Secret Storage**: JWT secret via environment variables
- **Database Credentials**: Via DATABASE_URL environment variable
- **Configuration**: Sensitive data kept out of source code

## Environment Configuration

### Required Variables

- `PORT` (default: 4000): Server port number
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL` (default: redis://localhost:6379): Redis connection URL
- `JWT_SECRET`: Secret key for JWT signing (change in production!)
- `NODE_ENV` (default: development): Environment mode

### Example .env File

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/perdiem
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm package manager
- Docker and Docker Compose
- PostgreSQL
- Redis

### Setup Commands

1. **Start databases**:

```bash
docker-compose up -d
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Setup environment**:

```bash
cp env-example .env
# Edit .env if needed
```

4. **Run database migration**:

```bash
pnpm run db:migrate
```

5. **Start the server**:

```bash
pnpm run dev
```

### Available Scripts

- `pnpm run dev`: Start development server with file watching
- `pnpm run build`: Compile TypeScript to JavaScript
- `pnpm run start`: Start production server (from dist/)
- `pnpm run db:migrate`: Run database migration script
- `pnpm run test`: Run tests (if configured)

### Testing API

Use the Host header to specify which store:

```bash
# Get store A info
curl -H "Host: a.localhost:4000" http://localhost:4000/

# Sign up for store A
curl -X POST -H "Host: a.localhost:4000" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@perdiem.com", "password": "securePassword123"}' \
  http://localhost:4000/signup

# Login to store A
curl -X POST -H "Host: a.localhost:4000" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@perdiem.com", "password": "securePassword123"}' \
  http://localhost:4000/login
```

For `/profile`, include the JWT token:

```bash
curl -H "Host: a.localhost:4000" \
  -H "Authorization: Bearer JWT_TOKEN" \
  http://localhost:4000/profile
```

## Default Stores

The migration creates 3 default stores:

- Store A with subdomain `a.localhost:4000`
- Store B with subdomain `b.localhost:4000`
- Store C with subdomain `c.localhost:4000`

Each store has its own theme color and welcome message, allowing for easy testing of the multi-tenant functionality.

