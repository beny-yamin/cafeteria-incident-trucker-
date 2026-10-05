const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    const message = `Resource not found with invalid id format: ${error.value}`;
    error = new ApiError(400, message);
  }
  // Handle MongoDB duplicate key error (code 11000)
  else if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new ApiError(409, message);
  }
  // Handle Mongoose validation error
  else if (error.name === 'ValidationError') {
    const message = Object.values(error.errors || {})
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(400, message || 'Validation failed');
  }
  // Handle Multer file upload errors
  else if (error.name === 'MulterError') {
    let message = `File upload error: ${error.message}`;
    if (error.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file is too large. Maximum size is 5MB.';
    }
    error = new ApiError(400, message);
  }
  // Fallback for generic errors
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message || 'Something went wrong',
    errors: error.errors || []
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
