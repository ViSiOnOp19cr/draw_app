# HTTP Backend for Draw App

## Database Setup with Neon DB

This application uses Neon DB, a serverless PostgreSQL service. Follow these steps to set it up:

1. Sign up for a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Create a new database in your project
4. Get your connection string from the Neon dashboard
5. Set your connection string in the `.env` file:

```
DATABASE_URL=postgres://user:password@yourproject.neon.tech/neondb
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3001
JWT_SECRET=your-secret-key
DATABASE_URL=your-neon-connection-string
```

## Running the Application

```bash
# Install dependencies
pnpm install

# Start the server
pnpm run dev
```

## API Endpoints

### Authentication

- **POST /api/auth/signup**: Register a new user
  - Body: `{ username, email, password }`
  
- **POST /api/auth/signin**: Login
  - Body: `{ email, password }`

### Rooms

- **GET /api/rooms**: Get all rooms (requires authentication)
  
- **POST /api/rooms**: Create a new room (requires authentication)
  - Body: `{ name, isPrivate }`
  
- **GET /api/rooms/:id**: Get room details (requires authentication)
  
- **POST /api/rooms/:id/join**: Join a room (requires authentication)
  - Body: `{ accessCode }` (required for private rooms)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
``` 