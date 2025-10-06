## Running the Development Environment

To start the full development environment:

```bash
# Build and start all services
docker compose up --build -d
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Services

### PostgreSQL

- Runs on port 5432
- Database name: `perdiem`
- User: `postgres`
- Password: `postgres`

### Redis

- Runs on port 6379
- Used for caching and session storage

### Backend API

- Runs on port 4000
- Auto-reloads on code changes
- Connects to PostgreSQL and Redis
- Environment variables configured in docker-compose.yml

### Frontend App

- Runs on port 3000
- Auto-reloads on code changes
- Connects to backend API at http://localhost:4000
- Environment variables configured in docker-compose.yml

## Development Features

- **Hot Reload**: Code changes are automatically reflected in the running containers
- **Volume Mounts**: Source code is mounted from your local machine to containers
- **Dependencies Cached**: node_modules volume prevents reinstalling dependencies on every change
- **Service Dependencies**: Services start in correct order with proper dependencies

## Useful Commands

```bash
# Start services in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v

# Run database migration (if needed)
docker-compose run backend pnpm run db:migrate

# Execute command in running container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres
```

## Project Structure in Containers

- Backend code: `/app` in the backend container
- Frontend code: `/app` in the frontend container
- Changes made on your local machine are reflected in the containers automatically

