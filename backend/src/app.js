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
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Global Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

app.get('/api/v1/health', (req, res) => {
  return res.status(200).json(new ApiResponse(200, { status: 'healthy' }, 'Server is healthy'));
});

// API Routes
app.use('/api/v1/auth', authenticationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dining-halls', diningHallRoutes);
app.use('/api/v1/incident-reports', incidentReportRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
