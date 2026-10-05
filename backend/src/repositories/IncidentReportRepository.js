const IncidentReport = require('../models/IncidentReport');

class IncidentReportRepository {
  async create(data) {
    const report = await IncidentReport.create(data);
    return await this.findById(report._id);
  }

  async findById(id) {
    return await IncidentReport.findById(id)
      .populate('hallId', 'name campus supervisorName isActive')
      .populate('studentId', 'fullName email role')
      .populate('assignedInspectorId', 'fullName email badgeNumber');
  }

  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options;
    return await IncidentReport.find(filter)
      .populate('hallId', 'name campus supervisorName isActive')
      .populate('studentId', 'fullName email role')
      .populate('assignedInspectorId', 'fullName email badgeNumber')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async findByStudentId(studentId, options = {}) {
    return await this.findAll({ studentId }, options);
  }

  async findByHallId(hallId, options = {}) {
    return await this.findAll({ hallId }, options);
  }

  async findByHallIds(hallIds = [], options = {}) {
    return await this.findAll({ hallId: { $in: hallIds } }, options);
  }

  async findByInspectorId(inspectorId, options = {}) {
    return await this.findAll({ assignedInspectorId: inspectorId }, options);
  }

  async count(filter = {}) {
    return await IncidentReport.countDocuments(filter);
  }

  async updateById(id, updateData) {
    return await IncidentReport.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true
    })
      .populate('hallId', 'name campus supervisorName isActive')
      .populate('studentId', 'fullName email role')
      .populate('assignedInspectorId', 'fullName email badgeNumber');
  }

  async deleteById(id) {
    return await IncidentReport.findByIdAndDelete(id);
  }
}

module.exports = new IncidentReportRepository();
