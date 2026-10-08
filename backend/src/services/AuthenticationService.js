const firebaseAdmin = require('../config/firebase');
const userRepository = require('../repositories/UserRepository');
const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../utils/constants');

class AuthenticationService {
  async verifyFirebaseToken(idToken) {
    const isMockToken =
      idToken.startsWith('mock-') || idToken.startsWith('dev-') || idToken.startsWith('test-');
    const allowMock =
      process.env.NODE_ENV === 'development' ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      process.env.ALLOW_DEMO_TOKENS === 'true';

    if (isMockToken && allowMock) {
      const parts = idToken.split('-');
      const roleHint = parts[1] || 'student';
      const role = ['admin', 'inspector', 'student'].includes(roleHint) ? roleHint : 'student';
      return {
        uid: `dev-uid-${role}`,
        email: `${role}@university.edu`,
        name: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`
      };
    }

    if (isMockToken && !allowMock) {
      throw new ApiError(401, 'Demo mock tokens are disabled in production. Please sign in with Firebase.');
    }

    // Ensure token is a valid string with 3 JWT segments before calling Firebase Admin
    if (typeof idToken !== 'string' || idToken.split('.').length !== 3) {
      throw new ApiError(401, 'Malformed token: Expected a valid Firebase ID token (JWT format).');
    }

    try {
      return await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new ApiError(401, `Invalid or expired Firebase authentication token: ${error.message}`);
    }
  }

  async syncFirebaseUser(decodedToken, bodyData = {}) {
    const { uid, email, name } = decodedToken;

    if (!email) {
      throw new ApiError(400, 'User email is required from authentication provider');
    }

    let user = await userRepository.findByFirebaseUid(uid, true);

    if (!user) {
      // Check if user exists by email
      user = await userRepository.findByEmail(email);
      if (user) {
        user = await userRepository.updateById(user._id, { firebaseUid: uid });
      } else {
        const validRoles = [USER_ROLES.STUDENT, USER_ROLES.INSPECTOR, USER_ROLES.ADMIN];
        const requestedRole =
          bodyData && bodyData.role && validRoles.includes(bodyData.role)
            ? bodyData.role
            : null;

        const initialRole =
          requestedRole ||
          decodedToken.role ||
          (email.includes('admin') || uid.includes('admin')
            ? USER_ROLES.ADMIN
            : email.includes('inspector') || uid.includes('inspector')
            ? USER_ROLES.INSPECTOR
            : USER_ROLES.STUDENT);

        user = await userRepository.create({
          firebaseUid: uid,
          email: email.toLowerCase(),
          fullName: (bodyData && bodyData.fullName) || name || email.split('@')[0],
          role: initialRole,
          assignedHalls: []
        });
      }
    }

    return user;
  }
}

module.exports = new AuthenticationService();
