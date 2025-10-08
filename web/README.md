# Perdiemin Frontend Documentation

## Pages Implementation

The frontend application includes these main pages:

- **Home Page** (`app/page.tsx`): Displays store-specific information with dynamic theming
- **Login Page** (`app/login/page.tsx`): Authentication for existing users
- **Signup Page** (`app/signup/page.tsx`): User registration with store-specific accounts
- **Profile Page** (`app/profile/page.tsx`): Protected page showing user information with update capability

## State Management

The application uses React Context for global state management:

- **Auth Context** (`lib/contexts/AuthContext.tsx`): Manages user authentication state (login, logout, user data)
- **Theme Context** (`lib/contexts/ThemeContext.tsx`): Manages dynamic theming based on store settings
- Provides loading and error states
- Automatically updates based on current subdomain

## API Integration

API helper functions in `web/lib/api.ts` provide:

- Subdomain handling for multi-tenant routing
- Authentication functions (signup, login, getProfile, updateProfile, logout)
- Store information fetching
- JWT token management in localStorage
- Error handling for network requests

## Multi-Tenant Features

- Dynamic subdomain detection (a.localhost:3000, b.localhost:3000, etc.)
- Store-specific theming with color schemes
- Isolated user accounts per store
- Subdomain-aware authentication

## Components

The application includes reusable UI components:
- **Button** (`app/components/Button.tsx`): Custom styled button component
- **Card** (`app/components/Card.tsx`): Container for content sections
- **Input** (`app/components/Input.tsx`): Form input with validation and error display
- **Navbar** (`app/components/Navbar.tsx`): Navigation bar with authentication links

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
