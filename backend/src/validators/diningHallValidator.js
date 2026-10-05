const ApiError = require('../utils/ApiError');

const validateCreateDiningHall = (req, res, next) => {
  const { name, campus, supervisorName, isActive } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return next(new ApiError(400, 'Dining hall name is required'));
  }

  if (!campus || typeof campus !== 'string' || !campus.trim()) {
    return next(new ApiError(400, 'Campus name is required'));
  }

  if (supervisorName !== undefined && typeof supervisorName !== 'string') {
    return next(new ApiError(400, 'Supervisor name must be a string'));
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return next(new ApiError(400, 'isActive must be a boolean'));
  }

  next();
};

const validateUpdateDiningHall = (req, res, next) => {
  const { name, campus, supervisorName, isActive } = req.body;

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return next(new ApiError(400, 'Dining hall name cannot be empty'));
  }

  if (campus !== undefined && (typeof campus !== 'string' || !campus.trim())) {
    return next(new ApiError(400, 'Campus name cannot be empty'));
  }

  if (supervisorName !== undefined && typeof supervisorName !== 'string') {
    return next(new ApiError(400, 'Supervisor name must be a string'));
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return next(new ApiError(400, 'isActive must be a boolean'));
  }

  next();
};

module.exports = {
  validateCreateDiningHall,
  validateUpdateDiningHall
};
