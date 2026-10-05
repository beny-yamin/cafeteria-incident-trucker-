const authenticationService = require('../services/AuthenticationService');
const ApiError = require('../utils/ApiError');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authorization token is required (Bearer <token>)');
    }

    const token = authHeader.split('Bearer ')[1].trim();
    if (!token) {
      throw new ApiError(401, 'Malformed authorization header');
    }

    const decodedToken = await authenticationService.verifyFirebaseToken(token);
    const user = await authenticationService.syncFirebaseUser(decodedToken);

    if (user.isActive === false) {
      throw new ApiError(403, 'User account has been deactivated');
    }

    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
