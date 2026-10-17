const firebaseAdmin = require('../config/firebase');
const userRepository = require('../repositories/UserRepository');
const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../utils/constants');

class AuthenticationService {
  async verifyFirebaseToken(idToken) {
    // Ensure token is a valid string with 3 JWT segments before calling Firebase Admin
    if (typeof idToken !== 'string' || idToken.split('.').length !== 3) {
      throw new ApiError(401, 'Authentication required: Please sign in with your account.');
    }

    try {
      return await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new ApiError(401, `Invalid or expired session token: ${error.message}`);
    }
  }

  async syncFirebaseUser(decodedToken, bodyData = {}) {
    const { uid, email, name } = decodedToken;

    if (!email) {
      throw new ApiError(400, 'User email is required from authentication provider');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user exists by firebaseUid
    let user = await userRepository.findByFirebaseUid(uid, true);

    // 2. If not found by UID, check if user exists by email
    if (!user) {
      user = await userRepository.findByEmail(normalizedEmail);
      if (user) {
        user = await userRepository.updateById(user._id, {
          firebaseUid: uid,
          ...(bodyData.fullName && { fullName: bodyData.fullName }),
          ...(bodyData.role && { role: bodyData.role })
        });
      }
    }

    // 3. If still not found, create new user with race-condition catch
    if (!user) {
      const validRoles = [USER_ROLES.STUDENT, USER_ROLES.INSPECTOR, USER_ROLES.ADMIN];
      const requestedRole =
        bodyData && bodyData.role && validRoles.includes(bodyData.role)
          ? bodyData.role
          : null;

      const initialRole =
        requestedRole ||
        decodedToken.role ||
        (normalizedEmail.includes('admin') || uid.includes('admin')
          ? USER_ROLES.ADMIN
          : normalizedEmail.includes('inspector') || uid.includes('inspector')
          ? USER_ROLES.INSPECTOR
          : USER_ROLES.STUDENT);

      try {
        user = await userRepository.create({
          firebaseUid: uid,
          email: normalizedEmail,
          fullName: (bodyData && bodyData.fullName) || name || normalizedEmail.split('@')[0],
          role: initialRole,
          assignedHalls: []
        });
      } catch (err) {
        // Concurrency catch: if another parallel request created the user milliseconds before us (E11000 duplicate key)
        if (err.code === 11000) {
          user =
            (await userRepository.findByFirebaseUid(uid, true)) ||
            (await userRepository.findByEmail(normalizedEmail));
          if (user) {
            user = await userRepository.updateById(user._id, {
              firebaseUid: uid,
              ...(bodyData.fullName && { fullName: bodyData.fullName }),
              ...(bodyData.role && { role: bodyData.role })
            });
            return user;
          }
        }
        throw err;
      }
    } else if (bodyData && (bodyData.fullName || bodyData.role)) {
      // User exists, update fields if new details are provided
      const updates = {};
      if (bodyData.fullName && user.fullName !== bodyData.fullName) updates.fullName = bodyData.fullName;
      if (bodyData.role && user.role !== bodyData.role) updates.role = bodyData.role;
      if (Object.keys(updates).length > 0) {
        user = await userRepository.updateById(user._id, updates);
      }
    }

    return user;
  }
}

module.exports = new AuthenticationService();
