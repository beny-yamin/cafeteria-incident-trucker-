# Frontend - University Food Quality System

React + Vite frontend client for the University Food Quality Assurance and Incident Reporting System.

## Architecture

```
frontend/
├── src/
│   ├── components/      # Reusable UI components (Navbar, Cards, Modals, Forms)
│   ├── pages/           # View pages (Home, IncidentReport, Dashboard, Login)
│   ├── services/        # API client and HTTP services
│   ├── hooks/           # Custom React hooks (useAuth, useFetch)
│   ├── context/         # React Context providers (AuthContext)
│   ├── routes/          # Application routing definitions
│   ├── utils/           # Helper functions and constants
│   ├── config/          # Firebase and environment config
│   ├── App.jsx          # Root application component
│   ├── main.jsx         # React application entry point
│   └── index.css        # Global CSS styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── .env                 # Environment variables
├── .env.example         # Example environment template
└── package.json
```

## Setup & Running

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
