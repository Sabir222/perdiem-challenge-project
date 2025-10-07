# Backend Improvements Todo List

## Security Enhancements
- [x] Add Helmet for security headers
- [ ] Remove fallback JWT secret in `src/utils/auth.ts` (require as mandatory env var)
- [ ] Implement rate limiting for auth endpoints using express-rate-limit
- [ ] Add input sanitization beyond validation
- [ ] Improve subdomain validation in middleware

## Error Handling & Logging
- [ ] Create custom error classes (ValidationError, AuthenticationError, NotFoundError, etc.)
- [ ] Implement centralized error handling middleware
- [ ] Add structured logging with a logging library (Winston/Pino)
- [ ] Add request ID tracking for debugging
- [ ] Improve error context and detail in logs

## Configuration Management
- [ ] Create a centralized config module with environment validation
- [ ] Add startup validation for required environment variables
- [ ] Add database connection pool configuration optimization
- [ ] Add type-safe configuration access

## Authentication & Authorization
- [ ] Implement refresh token functionality
- [ ] Add logout endpoint with token invalidation
- [ ] Add password reset functionality with email verification
- [ ] Add account verification system

## Performance & Caching
- [x] Reduce Redis cache TTL from 1 hour to 5 minutes
- [ ] Add database query optimization (add indexes)
- [ ] Add cache invalidation strategies
- [ ] Optimize database connection pooling

## Code Quality & Architecture
- [ ] Add request/response logging middleware
- [ ] Add health check endpoints
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add graceful shutdown handling for Redis/DB connections
- [ ] Add API versioning support
- [ ] Add request ID correlation for debugging

## Missing Features
- [ ] Add user profile update endpoints
- [ ] Add admin functions for store management
- [ ] Add session management features
- [ ] Add monitoring and metrics collection

## Testing
- [ ] Add unit tests for service layer functions
- [ ] Add integration tests for all API endpoints
- [ ] Add error scenario tests
- [ ] Add authentication flow tests
- [ ] Add validation tests

## Database & Security
- [ ] Add database indexes for frequently queried fields (email, store_id)
- [ ] Add connection health checks
- [ ] Add additional password policy checks (dictionary, common passwords)
- [ ] Implement token blacklisting/revocation system

## Monitoring & Observability
- [ ] Add application performance monitoring
- [ ] Add error tracking and alerting
- [ ] Add API usage analytics
- [ ] Add comprehensive health check endpoint (DB, Redis, external services)

## Architecture Improvements
- [ ] Consider implementing dependency injection pattern
- [ ] Add more comprehensive API response types
- [ ] Add request/response transformation layers
- [ ] Add data access layer abstraction for better testing