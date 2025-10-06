# Backend Architecture Explanation

This backend is a Node.js + TypeScript API designed for a multi-tenant application with store-specific authentication. It follows the challenge requirements by supporting subdomain-based store isolation.

## Project Structure

```
server/
├── src/
│   ├── index.ts                 # Main application entry point
│   ├── models.ts                # TypeScript interfaces for Store and User
│   ├── middleware.ts            # Subdomain extraction middleware
│   ├── auth.ts                  # JWT authentication middleware
│   ├── services.ts              # Business logic layer
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

## Core Components

### 1. Entry Point (`index.ts`)
- Sets up Express server with CORS and JSON parsing
- Connects to Redis
- Applies middleware for subdomain extraction
- Routes requests to store API handlers

### 2. Data Models (`models.ts`)
- **Store**: Contains store information (id, name, slug, welcome_message, theme, timestamps)
- **User**: Contains user information (id, email, hashed password, store_id, timestamps)
- The theme field stores CSS theme information as text (e.g., hex color codes)

### 3. Subdomain Middleware (`middleware.ts`)
- Extracts store slug from subdomain (a.localhost:3000 → "a")
- Fetches store from Redis cache or database
- Attaches store data to request object (`req.currentStore`)
- Uses TypeScript declaration merging to extend Express Request type

### 4. Authentication System (`auth.ts`, `utils/auth.ts`)
- **JWT-based authentication** with 24-hour expiration
- Token contains `userId` and `storeId` for proper isolation
- Verifies user belongs to the current store to prevent cross-store access
- Uses Bearer token format in Authorization header

### 5. Database Layer (`db/`)
- **PostgreSQL** connection pool for data storage
- **Migration script** creates stores and users tables with proper relationships
- Stores table has foreign key relationships to support multi-tenancy

### 6. Caching Layer (`redis/`)
- **Redis client** for caching store data
- **Caching strategy**: Store data cached for 1 hour to improve performance
- Reduces database load for frequently accessed store information

### 7. Business Logic (`services.ts`)
- **StoreService**: Handles store operations with caching
- **UserService**: Handles user operations (create, find by email/store, find by ID/store)
- Proper isolation - users are tied to specific stores

### 8. API Routes (`routes/store.ts`)
- **GET /**: Returns current store information
- **POST /signup**: Creates user in the current store
- **POST /login**: Authenticates user and returns JWT token
- **GET /profile**: Protected route requiring authentication
- All routes ensure operations are restricted to the current store

## Multi-tenancy Implementation

### Store Isolation
- Each subdomain (a.localhost:3000, b.localhost:3000) maps to a different store
- Users are tied to specific stores via `store_id` foreign key
- Authentication middleware ensures users can only access their store's resources

### Data Relationships
```
stores (id) ←→ users (store_id)
```
- Each user belongs to exactly one store
- Store-specific queries prevent cross-store data access

## Security Features

1. **Password Hashing**: Uses bcrypt with 10 rounds for secure password storage
2. **JWT Tokens**: Time-limited tokens with embedded store association
3. **Store Isolation**: Authentication ensures users can't access other stores' data
4. **Input Validation**: Email/password validation on signup/login
5. **Environment Variables**: Secure storage of secrets (JWT secret, database URL)

## Performance Optimizations

1. **Redis Caching**: Store data cached for 1 hour to reduce database queries
2. **Connection Pooling**: PostgreSQL connection pool for efficient database connections
3. **Type Safety**: TypeScript provides compile-time error checking

## Environment Configuration

### Required Environment Variables
- `PORT`: Server port (default: 4000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)
- `JWT_SECRET`: Secret for JWT signing
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

### Public Endpoints
- `GET /` - Get current store information
- `POST /signup` - Create user in current store
- `POST /login` - Authenticate user and get token

### Protected Endpoints
- `GET /profile` - Get authenticated user profile (requires Bearer token)

## How Subdomain Routing Works

1. **Request** → `a.localhost:3000`
2. **Middleware** extracts "a" from subdomain
3. **Database lookup** finds store with slug "a"
4. **Store data** attached to request as `req.currentStore`
5. **Route handlers** have access to the current store

## Key Design Decisions

1. **Simple Theme Field**: Single text field for storing theme information (hex colors)
2. **JWT Authentication**: Stateless authentication for scalability
3. **Caching Strategy**: Only cache store data, not user data (for privacy/security)
4. **Type Safety**: Full TypeScript coverage with custom type declarations
5. **Modular Architecture**: Separated concerns into models, services, middleware, utils

This architecture provides a solid foundation for a multi-tenant application with proper isolation, authentication, and performance optimizations.