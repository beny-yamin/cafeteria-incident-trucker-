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

## Pre-Configured Role Accounts (Firebase & MongoDB)

The system includes pre-configured instance accounts for all three roles. You can sign in immediately using these credentials or the 1-click autofill on the authentication page:

| Role | Email | Default Password | Initial View |
| :--- | :--- | :--- | :--- |
| **Student Reporter** | `student@university.edu` | `Student123!` | Student Dashboard (Report hazards, view halls) |
| **Safety Inspector** | `inspector@university.edu` | `Inspector123!` | Inspector Triage (Claim & resolve reports) |
| **Campus Administrator** | `admin@university.edu` | `Admin123!` | Campus Admin (Manage halls & assign staff) |

### Re-sync or Reset Default Accounts:
To re-sync these accounts in MongoDB, run:
```bash
npm run seed:accounts
```

### Changing Account Passwords:
1. **Via Dashboard**: When signed into any account, click the **Password** button in the top navigation bar to change your password immediately.
2. **Via Forgot Password**: Click "Forgot password?" on the Sign In page to receive a password reset link to your email.
3. **Via Firebase Console**: In your Firebase project (`jaaamin-rox`) under **Authentication > Users**, you can edit passwords directly.

## API Endpoints Overview

- `GET /api/v1/health` - Server health check
- `POST /api/v1/auth/sync` - Synchronize Firebase authenticated user
- `GET /api/v1/auth/me` - Get currently authenticated user profile
- `GET /api/v1/dining-halls` - List active dining halls
- `POST /api/v1/incident-reports` - Submit food quality incident report (with multipart photo upload)
- `GET /api/v1/incident-reports/my-reports` - List authenticated user's incident reports
- `PATCH /api/v1/incident-reports/:id/status` - Staff/Admin update incident status and resolution
