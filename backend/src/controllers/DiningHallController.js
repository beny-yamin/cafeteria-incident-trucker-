const diningHallService = require('../services/DiningHallService');
const ApiResponse = require('../utils/ApiResponse');

class DiningHallController {
  async getAllDiningHalls(req, res, next) {
    try {
      const { campus, activeOnly, search } = req.query;
      const filter = {};

      if (campus) {
        filter.campus = { $regex: new RegExp(campus.trim(), 'i') };
      }

      if (activeOnly !== undefined) {
        filter.isActive = activeOnly === 'true' || activeOnly === true;
      }

      if (search) {
        filter.name = { $regex: new RegExp(search.trim(), 'i') };
      }

      const diningHalls = await diningHallService.getAllDiningHalls(filter);
      return res
        .status(200)
        .json(new ApiResponse(200, diningHalls, 'Dining halls retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDiningHallById(req, res, next) {
    try {
      const diningHall = await diningHallService.getDiningHallById(req.params.id);
      return res
        .status(200)
        .json(new ApiResponse(200, diningHall, 'Dining hall retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async createDiningHall(req, res, next) {
    try {
      const diningHall = await diningHallService.createDiningHall(req.body);
      return res
        .status(201)
        .json(new ApiResponse(201, diningHall, 'Dining hall created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateDiningHall(req, res, next) {
    try {
      const diningHall = await diningHallService.updateDiningHall(req.params.id, req.body);
      return res
        .status(200)
        .json(new ApiResponse(200, diningHall, 'Dining hall updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteDiningHall(req, res, next) {
    try {
      await diningHallService.deleteDiningHall(req.params.id);
      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Dining hall removed successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DiningHallController();
