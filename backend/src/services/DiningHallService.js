const diningHallRepository = require('../repositories/DiningHallRepository');
const ApiError = require('../utils/ApiError');

class DiningHallService {
  async getAllDiningHalls(filter = {}, options = {}) {
    return await diningHallRepository.findAll(filter, options);
  }

  async getActiveDiningHalls() {
    return await diningHallRepository.findActive();
  }

  async getDiningHallsByCampus(campus, activeOnly = false) {
    if (!campus || !campus.trim()) {
      throw new ApiError(400, 'Campus parameter is required');
    }
    return await diningHallRepository.findByCampus(campus, activeOnly);
  }

  async getDiningHallById(id) {
    const diningHall = await diningHallRepository.findById(id);
    if (!diningHall) {
      throw new ApiError(404, 'Dining hall not found');
    }
    return diningHall;
  }

  async createDiningHall(data) {
    const existing = await diningHallRepository.findByName(data.name);
    if (existing) {
      throw new ApiError(409, `Dining hall with name '${data.name}' already exists`);
    }

    const payload = {
      name: data.name.trim(),
      campus: data.campus.trim(),
      supervisorName: data.supervisorName ? data.supervisorName.trim() : '',
      isActive: data.isActive !== undefined ? data.isActive : true
    };

    return await diningHallRepository.create(payload);
  }

  async updateDiningHall(id, data) {
    const diningHall = await diningHallRepository.findById(id);
    if (!diningHall) {
      throw new ApiError(404, 'Dining hall not found');
    }

    if (data.name && data.name.trim().toLowerCase() !== diningHall.name.toLowerCase()) {
      const existing = await diningHallRepository.findByName(data.name);
      if (existing && existing._id.toString() !== id.toString()) {
        throw new ApiError(409, `Dining hall with name '${data.name}' already exists`);
      }
    }

    return await diningHallRepository.updateById(id, data);
  }

  async deleteDiningHall(id) {
    const diningHall = await diningHallRepository.deleteById(id);
    if (!diningHall) {
      throw new ApiError(404, 'Dining hall not found');
    }
    return diningHall;
  }
}

module.exports = new DiningHallService();
