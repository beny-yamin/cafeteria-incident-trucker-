const userRepository = require('../repositories/UserRepository');
const diningHallRepository = require('../repositories/DiningHallRepository');
const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../utils/constants');

class UserService {
  async getUserById(userId) {
    const user = await userRepository.findById(userId, true);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async getUserByFirebaseUid(firebaseUid) {
    const user = await userRepository.findByFirebaseUid(firebaseUid, true);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowedUpdates = ['fullName', 'badgeNumber'];
    const filteredUpdates = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key) && updateData[key] !== undefined) {
        filteredUpdates[key] = typeof updateData[key] === 'string' ? updateData[key].trim() : updateData[key];
      }
    });

    const updatedUser = await userRepository.updateById(userId, filteredUpdates);
    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }
    return updatedUser;
  }

  async updateUserRole(userId, newRole) {
    const validRoles = Object.values(USER_ROLES);
    if (!validRoles.includes(newRole)) {
      throw new ApiError(400, `Invalid role '${newRole}'. Allowed roles: [${validRoles.join(', ')}]`);
    }

    const updates = { role: newRole };
    if (newRole !== USER_ROLES.INSPECTOR) {
      updates.assignedHalls = [];
    }

    const user = await userRepository.updateById(userId, updates);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async assignHallsToInspector(userId, hallIds = []) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.role !== USER_ROLES.INSPECTOR) {
      throw new ApiError(400, `Cannot assign dining halls to user with role '${user.role}'. User must be an inspector.`);
    }

    // Verify all hall IDs exist
    for (const hallId of hallIds) {
      const hall = await diningHallRepository.findById(hallId);
      if (!hall) {
        throw new ApiError(404, `Dining hall with ID '${hallId}' not found`);
      }
    }

    return await userRepository.assignHalls(userId, hallIds);
  }

  async getAllUsers(filter = {}, options = {}) {
    const users = await userRepository.findAll(filter, options);
    const total = await userRepository.count(filter);
    return { users, total };
  }

  async getInspectors(options = {}) {
    const inspectors = await userRepository.findByRole(USER_ROLES.INSPECTOR, options);
    const total = await userRepository.count({ role: USER_ROLES.INSPECTOR });
    return { inspectors, total };
  }
}

module.exports = new UserService();
