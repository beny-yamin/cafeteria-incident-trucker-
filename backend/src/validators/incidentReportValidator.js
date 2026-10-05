const ApiError = require('../utils/ApiError');
const {
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  MEAL_TYPES,
  TERMINAL_STATUSES
} = require('../utils/constants');

const validateCreateIncidentReport = (req, res, next) => {
  const { hallId, mealType, category, severity, description } = req.body;

  if (!hallId || typeof hallId !== 'string' || !hallId.trim()) {
    return next(new ApiError(400, 'Dining hall ID (hallId) is required'));
  }

  const validMealTypes = Object.values(MEAL_TYPES);
  if (!mealType || !validMealTypes.includes(mealType)) {
    return next(
      new ApiError(400, `Meal type is required and must be one of: [${validMealTypes.join(', ')}]`)
    );
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    return next(new ApiError(400, 'Incident category is required'));
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return next(new ApiError(400, 'Incident description is required'));
  }

  if (severity) {
    const validSeverities = Object.values(INCIDENT_SEVERITIES);
    if (!validSeverities.includes(severity)) {
      return next(
        new ApiError(400, `Severity must be one of: [${validSeverities.join(', ')}]`)
      );
    }
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status, inspectorNote } = req.body;

  const validStatuses = Object.values(INCIDENT_STATUSES);
  if (!status || !validStatuses.includes(status)) {
    return next(
      new ApiError(400, `Target status must be one of: [${validStatuses.join(', ')}]`)
    );
  }

  // Invariant 2: Mandatory notes for terminal states
  if (TERMINAL_STATUSES.includes(status)) {
    if (!inspectorNote || typeof inspectorNote !== 'string' || !inspectorNote.trim()) {
      return next(
        new ApiError(
          400,
          `Mandatory inspector note required when transitioning report to status '${status}'`
        )
      );
    }
  }

  next();
};

const validateResolutionNote = (req, res, next) => {
  const { inspectorNote } = req.body;
  if (!inspectorNote || typeof inspectorNote !== 'string' || !inspectorNote.trim()) {
    return next(new ApiError(400, 'A non-empty inspectorNote is required'));
  }
  next();
};

module.exports = {
  validateCreateIncidentReport,
  validateUpdateStatus,
  validateResolutionNote
};
