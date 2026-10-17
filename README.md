# University Food Quality Assurance & Incident Reporting System

A comprehensive web application that enables university students, dining hall staff, and campus administrators to collaborate on food safety, transparency, and dining standards.

## Project Structure

```
university-food-quality-system/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── firebase.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── DiningHall.js
│   │   │   └── IncidentReport.js
│   │   │
│   │   ├── repositories/
│   │   │   ├── UserRepository.js
│   │   │   ├── DiningHallRepository.js
│   │   │   └── IncidentReportRepository.js
│   │   │
│   │   ├── services/
│   │   │   ├── UserService.js
│   │   │   ├── DiningHallService.js
│   │   │   ├── IncidentReportService.js
│   │   │   └── AuthenticationService.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── UserController.js
│   │   │   ├── DiningHallController.js
│   │   │   ├── IncidentReportController.js
│   │   │   └── AuthenticationController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── diningHallRoutes.js
│   │   │   ├── incidentReportRoutes.js
│   │   │   └── authenticationRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticationMiddleware.js
│   │   │   ├── authorizationMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── validators/
│   │   │   ├── userValidator.js
│   │   │   ├── diningHallValidator.js
│   │   │   └── incidentReportValidator.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── constants.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## Tech Stack

- **Frontend**: React, Vite, JavaScript
- **Backend**: Node.js, Express.js (Layered Repository-Service-Controller Architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Authentication (ID Tokens verified via Firebase Admin SDK)
- **File Uploads**: Multer (Local disk storage under `backend/uploads/`)

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Instant Role Credentials (Ready for Testing)

The system is configured with dedicated accounts for each role in Firebase Authentication (`jaaamin-rox`) and synchronized with MongoDB. When opening the application, the dedicated **Authentication Page** is displayed. You can use the **1-click Autofill** buttons on the sign-in screen:

| Role | Email | Password | Access & Dashboard |
| :--- | :--- | :--- | :--- |
| 🎓 **Student Reporter** | `student@university.edu` | `Student123!` | Student Dashboard: File hazard reports, view dining halls & active status |
| 🛡️ **Safety Inspector** | `inspector@university.edu` | `Inspector123!` | Inspector Triage: Claim, investigate, resolve or dismiss incidents |
| 👑 **Campus Administrator** | `admin@university.edu` | `Admin123!` | Campus Admin: Manage dining halls, assign inspectors, campus oversight |

### Role-Based Routing
- Access to all dashboards requires authentication (no unauthenticated demo preview).
- Upon signing in, users are automatically taken directly to their assigned role's dashboard.
- Users cannot manually bypass their assigned role.

### Changing Passwords Later
- **Inside the Application**: Click the **Password** button in the top navigation bar to open the **Change Password Modal** and set a new password anytime.
- **Forgot Password**: Use the "Forgot password?" option on the Sign In page to receive a Firebase reset link.
- **Firebase Console**: Manage accounts directly under Firebase Project `jaaamin-rox` > Authentication > Users.
- **Reset Default Credentials**: Run `npm run seed:accounts` inside the `backend` folder.

