const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../utils/constants');

const validateUpdateProfile = (req, res, next) => {
  const { fullName, badgeNumber } = req.body;

  if (fullName !== undefined && (typeof fullName !== 'string' || !fullName.trim())) {
    return next(new ApiError(400, 'fullName cannot be empty if provided'));
  }

  if (badgeNumber !== undefined && typeof badgeNumber !== 'string') {
    return next(new ApiError(400, 'badgeNumber must be a string'));
  }

  next();
};

const validateRoleUpdate = (req, res, next) => {
  const { role } = req.body;

  if (!role || !Object.values(USER_ROLES).includes(role)) {
    return next(
      new ApiError(
        400,
        `Invalid role. Must be one of: [${Object.values(USER_ROLES).join(', ')}]`
      )
    );
  }

  next();
};

const validateAssignHalls = (req, res, next) => {
  const { hallIds } = req.body;

  if (!Array.isArray(hallIds)) {
    return next(new ApiError(400, 'hallIds must be an array of dining hall IDs'));
  }

  for (const id of hallIds) {
    if (typeof id !== 'string' || !id.trim()) {
      return next(new ApiError(400, 'Each hallId in hallIds must be a valid non-empty string'));
    }
  }

  next();
};

module.exports = {
  validateUpdateProfile,
  validateRoleUpdate,
  validateAssignHalls
};
