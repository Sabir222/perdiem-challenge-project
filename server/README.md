# Backend Setup

## Setup

1. **Start databases**:
   ```bash
   docker-compose up -d
   ```

or

```bash
  docker compose up -d
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

Server will run on `http://localhost:4000`

## API Endpoints

- `GET /` - Get current store info
- `POST /signup` - Sign up for current store
- `POST /login` - Login to current store
- `GET /profile` - Get user profile (requires auth)

## Testing API

Use the Host header to specify which store:

```bash
# Get store A info
curl -H "Host: a.localhost:4000" http://localhost:4000/

# Sign up for store A
curl -X POST -H "Host: a.localhost:4000" \
  -H "Content-Type: application/json" \
  -d '{"email": "sabir@perdiem.com", "password": "sabir123"}' \
  http://localhost:4000/signup

# Login to store A
curl -X POST -H "Host: a.localhost:4000" \
  -H "Content-Type: application/json" \
  -d '{"email": "sabir@perdiem.com", "password": "sabir123"}' \
  http://localhost:4000/login
```

For `/profile`, include the JWT token:

```bash
curl -H "Host: a.localhost:4000" \
  -H "Authorization: Bearer JWT_TOKEN" \
  http://localhost:4000/profile
```

## Stores

The migration creates 3 stores by default:

- Store A with subdomain `a.localhost:4000`
- Store B with subdomain `b.localhost:4000`
- Store C with subdomain `c.localhost:4000`

