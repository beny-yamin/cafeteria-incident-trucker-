require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');
const ApiError = require('./utils/ApiError');
const ApiResponse = require('./utils/ApiResponse');

// Import routes
const userRoutes = require('./routes/userRoutes');
const diningHallRoutes = require('./routes/diningHallRoutes');
const incidentReportRoutes = require('./routes/incidentReportRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://cafeteria-incident-trucker-frontend.onrender.com',
  'https://cafeteria-incident-trucker.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach((origin) => {
    const trimmed = origin.trim().replace(/\/+$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile, curl, Postman, health probes)
    if (!origin) return callback(null, true);

    const sanitizedOrigin = origin.replace(/\/+$/, '');
    const isAllowed =
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes(sanitizedOrigin) ||
      sanitizedOrigin.endsWith('.onrender.com');

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
};

// Global Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Serve static uploads
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));
app.use('/api/uploads', express.static(uploadsPath));
app.use('/api/v1/uploads', express.static(uploadsPath));

// Base & Health check routes
app.get('/', (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { service: 'University Food Quality Assurance API', version: '1.0.0' },
      'API is active and running'
    )
  );
});

app.get('/health', (req, res) => {
  return res.status(200).json(new ApiResponse(200, { status: 'healthy' }, 'Server is healthy'));
});

app.get('/api/health', (req, res) => {
  return res.status(200).json(new ApiResponse(200, { status: 'healthy' }, 'Server is healthy'));
});

app.get('/api/v1/health', (req, res) => {
  return res.status(200).json(new ApiResponse(200, { status: 'healthy' }, 'Server is healthy'));
});

// API Routes (mounted at /api/v1 and aliased at /api for flexible client integration)
app.use('/api/v1/auth', authenticationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dining-halls', diningHallRoutes);
app.use('/api/v1/incident-reports', incidentReportRoutes);

app.use('/api/auth', authenticationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dining-halls', diningHallRoutes);
app.use('/api/incident-reports', incidentReportRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
