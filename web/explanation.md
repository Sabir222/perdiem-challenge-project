# Frontend Implementation Explanation

This document explains the Next.js frontend implementation that connects to the multi-tenant backend.

## Project Structure

```
web/
├── app/
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication context provider
│   ├── login/
│   │   └── page.tsx                 # Login form page
│   ├── profile/
│   │   └── page.tsx                 # User profile page
│   ├── signup/
│   │   └── page.tsx                 # Signup form page
│   ├── layout.tsx                   # Root layout with AuthProvider
│   └── page.tsx                     # Home page with store info
├── lib/
│   └── api.ts                       # API utility functions
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
└── README.md                        # Basic Next.js setup info
```

## Core Components

### 1. Authentication Context (`app/context/AuthContext.tsx`)
- **User state management**: Tracks currently logged-in user
- **Loading state**: Manages loading status during auth checks
- **Auth methods**: login, signup, logout, checkAuth functions
- **Initial check**: Verifies stored token on app initialization

### 2. API Utilities (`lib/api.ts`)
- **Subdomain detection**: Automatically detects current subdomain (a.localhost → 'a')
- **Dynamic URL construction**: Builds correct backend URL based on subdomain
- **Request headers**: Adds content type and authorization tokens
- **API functions**: getStoreInfo, signup, login, getProfile

### 3. Root Layout (`app/layout.tsx`)
- **AuthProvider wrapper**: Wraps entire app with authentication context
- **Font loading**: Loads Geist font family

### 4. Home Page (`app/page.tsx`)
- **Store info display**: Shows current store name and welcome message
- **Auth-aware UI**: Shows login/signup buttons when not authenticated
- **Profile/logout buttons**: Shows when authenticated
- **Subdomain switcher**: Simple buttons to switch between Store A and Store B
- **Responsive design**: Clean, centered layout

### 5. Login Page (`app/login/page.tsx`)
- **Simple form**: Email and password fields
- **Error handling**: Displays login errors
- **Navigation**: Links to signup page
- **Success redirect**: Redirects to home after successful login

### 6. Signup Page (`app/signup/page.tsx`)
- **Simple form**: Email and password fields
- **Error handling**: Displays signup errors
- **Navigation**: Links to login page
- **Success redirect**: Redirects to home after successful signup

### 7. Profile Page (`app/profile/page.tsx`)
- **Protected route**: Only accessible when authenticated
- **User data display**: Shows email, ID, and store ID
- **Auth check**: Redirects to login if unauthenticated
- **Navigation**: Back to home button

## Multi-tenancy Implementation

### Subdomain Handling
1. **Detection**: `getCurrentSubdomain()` function detects subdomain from browser URL
2. **URL Construction**: `getBackendUrl()` builds correct backend URL (e.g., `http://a.localhost:4000`)
3. **Automatic routing**: All API calls go to correct subdomain-specific backend

### Store Isolation
- Each subdomain connects to its own store data
- Users are isolated per store (user from Store A cannot access Store B)
- All API calls are context-aware of the current subdomain

## Authentication Flow

### Login Process
1. User enters credentials on login page
2. Request sent to correct subdomain backend
3. Backend validates credentials and returns JWT token
4. Token stored in localStorage
5. AuthContext updated with user data
6. User redirected to home page

### Session Persistence
1. On app initialization, AuthContext checks for stored token
2. If token exists, calls backend to verify and get user profile
3. Updates application state with user information
4. Maintains login status across page refreshes

### Logout Process
1. Click logout button on home page
2. Token removed from localStorage
3. AuthContext user state cleared
4. Page refreshed to reflect logged-out state

## UI Features

### Store Switcher
- Simple buttons at top of home page to switch between stores
- "Switch to A" and "Switch to B" buttons
- Visual indication of current store
- Direct navigation to subdomain URLs

### Responsive Design
- Clean, centered layout
- Mobile-friendly form elements
- Consistent styling across all pages
- Simple color scheme with hover effects

## Key Design Decisions

1. **Direct URL approach**: Instead of Host header manipulation, we construct the correct backend URL based on current subdomain
2. **localStorage for persistence**: JWT tokens stored in localStorage for session persistence
3. **Context API for state**: Authentication state managed through React Context API
4. **Simple auth flow**: Straightforward login/signup with immediate redirects
5. **Clean UI**: Minimal styling focusing on functionality over visual complexity
6. **Subdomain switcher**: Easy navigation between different tenant stores

## Security Considerations

1. **Token-based auth**: JWT tokens for stateless authentication
2. **Store isolation**: Users can only access their specific store's data
3. **Client-side validation**: Basic input validation on forms
4. **Secure token storage**: Tokens stored client-side with standard practices

## Development Setup

1. **Next.js 15**: Uses latest Next.js features
2. **TypeScript**: Full type safety across components
3. **Tailwind CSS**: Utility-first styling approach
4. **ESLint + TypeScript**: Code quality and type checking

This frontend provides a complete interface for the multi-tenant application, allowing users to seamlessly interact with different stores through subdomain-based routing while maintaining secure authentication and proper data isolation.