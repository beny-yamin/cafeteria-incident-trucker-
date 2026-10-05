const ApiError = require('../utils/ApiError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required prior to authorization'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
};

module.exports = authorize;
