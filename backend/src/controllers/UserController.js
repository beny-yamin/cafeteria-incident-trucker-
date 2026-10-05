const userService = require('../services/UserService');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user._id);
      return res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updatedUser = await userService.updateProfile(req.user._id, req.body);
      return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { role } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip = (page - 1) * limit;

      const filter = {};
      if (role) filter.role = role;

      const result = await userService.getAllUsers(filter, { skip, limit });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            ...result,
            page,
            totalPages: Math.ceil(result.total / limit)
          },
          'Users fetched successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getInspectors(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 50;
      const skip = (page - 1) * limit;

      const result = await userService.getInspectors({ skip, limit });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            ...result,
            page,
            totalPages: Math.ceil(result.total / limit)
          },
          'Inspectors fetched successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const updatedUser = await userService.updateUserRole(id, role);
      return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'User role updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async assignHallsToInspector(req, res, next) {
    try {
      const { id } = req.params;
      const { hallIds } = req.body;
      const updatedUser = await userService.assignHallsToInspector(id, hallIds);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedUser,
            'Dining halls assigned to inspector successfully'
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
