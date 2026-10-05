const User = require('../models/User');

class UserRepository {
  async findById(id, populateHalls = false) {
    const query = User.findById(id);
    if (populateHalls) {
      query.populate('assignedHalls', 'name campus supervisorName isActive');
    }
    return await query;
  }

  async findByFirebaseUid(firebaseUid, populateHalls = false) {
    const query = User.findOne({ firebaseUid });
    if (populateHalls) {
      query.populate('assignedHalls', 'name campus supervisorName isActive');
    }
    return await query;
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findByRole(role, options = {}) {
    const { skip = 0, limit = 50, sort = { createdAt: -1 } } = options;
    return await User.find({ role })
      .populate('assignedHalls', 'name campus supervisorName isActive')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async findInspectorsByHall(hallId) {
    return await User.find({
      role: 'inspector',
      assignedHalls: hallId
    });
  }

  async assignHalls(userId, hallIds) {
    return await User.findByIdAndUpdate(
      userId,
      { assignedHalls: hallIds },
      { returnDocument: 'after', runValidators: true }
    ).populate('assignedHalls', 'name campus supervisorName isActive');
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true
    }).populate('assignedHalls', 'name campus supervisorName isActive');
  }

  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 50, sort = { createdAt: -1 } } = options;
    return await User.find(filter)
      .populate('assignedHalls', 'name campus supervisorName isActive')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filter = {}) {
    return await User.countDocuments(filter);
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
