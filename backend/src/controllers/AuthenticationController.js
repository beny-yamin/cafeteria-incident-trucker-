const authenticationService = require('../services/AuthenticationService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

class AuthenticationController {
  async verifyAndSyncUser(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Bearer token is required');
      }

      const idToken = authHeader.split('Bearer ')[1].trim();
      const decodedToken = await authenticationService.verifyFirebaseToken(idToken);
      const user = await authenticationService.syncFirebaseUser(decodedToken, req.body);

      return res
        .status(200)
        .json(new ApiResponse(200, user, 'Authentication verified and synchronized successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      return res
        .status(200)
        .json(new ApiResponse(200, req.user, 'Current user retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthenticationController();
