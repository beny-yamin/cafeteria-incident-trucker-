const DiningHall = require('../models/DiningHall');

class DiningHallRepository {
  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 100, sort = { name: 1 } } = options;
    return await DiningHall.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async findById(id) {
    return await DiningHall.findById(id);
  }

  async findByName(name) {
    return await DiningHall.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
  }

  async findByCampus(campus, activeOnly = false) {
    const filter = {
      campus: { $regex: new RegExp(`^${campus.trim()}$`, 'i') }
    };
    if (activeOnly) {
      filter.isActive = true;
    }
    return await DiningHall.find(filter).sort({ name: 1 });
  }

  async findActive() {
    return await DiningHall.find({ isActive: true }).sort({ name: 1 });
  }

  async create(data) {
    return await DiningHall.create(data);
  }

  async updateById(id, updateData) {
    return await DiningHall.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true
    });
  }

  async deleteById(id) {
    return await DiningHall.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await DiningHall.countDocuments(filter);
  }
}

module.exports = new DiningHallRepository();
