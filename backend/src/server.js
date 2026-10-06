require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

connectDB()
  .then(() => {
    const server = app.listen(PORT, HOST, () => {
      console.log(`Food Quality System Backend running on ${HOST}:${PORT}`);
      console.log(`Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/v1/health`);
    });

    const shutdown = (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('Failed to start server due to database connection error:', err);
    process.exit(1);
  });
