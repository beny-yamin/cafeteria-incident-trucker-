# Backend - University Food Quality System

Node.js + Express backend service for the University Food Quality Assurance and Incident Reporting System.

## Architecture

```
backend/
├── src/
│   ├── config/          # Database and Firebase configurations
│   ├── models/          # Mongoose data schemas (User, DiningHall, IncidentReport)
│   ├── repositories/    # Database queries and data access layer
│   ├── services/        # Business logic layer
│   ├── controllers/     # Express route handlers
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Auth, authorization, file upload, error handling
│   ├── validators/      # Request validation logic
│   ├── utils/           # Custom error, response, and constant definitions
│   ├── app.js           # Express app setup and middleware pipeline
│   └── server.js        # Entry point and DB connection
├── uploads/             # Incident report image uploads
├── .env                 # Environment variables
├── .env.example         # Example environment template
└── package.json
```

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)
- Firebase Project for Authentication

## Setup & Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your MongoDB URI and Firebase Admin credentials.

4. Start development server:
   ```bash
   npm run dev
   ```

5. Production start:
   ```bash
   npm start
   ```

## API Endpoints Overview

- `GET /api/v1/health` - Server health check
- `POST /api/v1/auth/sync` - Synchronize Firebase authenticated user
- `GET /api/v1/auth/me` - Get currently authenticated user profile
- `GET /api/v1/dining-halls` - List active dining halls
- `POST /api/v1/incident-reports` - Submit food quality incident report (with multipart photo upload)
- `GET /api/v1/incident-reports/my-reports` - List authenticated user's incident reports
- `PATCH /api/v1/incident-reports/:id/status` - Staff/Admin update incident status and resolution
