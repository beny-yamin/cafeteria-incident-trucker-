const incidentReportRepository = require('../repositories/IncidentReportRepository');
const diningHallRepository = require('../repositories/DiningHallRepository');
const ApiError = require('../utils/ApiError');
const {
  USER_ROLES,
  INCIDENT_STATUSES,
  VALID_STATUS_TRANSITIONS,
  TERMINAL_STATUSES
} = require('../utils/constants');

class IncidentReportService {
  async createReport(reportData, studentUser) {
    const hallId = reportData.hallId;
    if (!hallId) {
      throw new ApiError(400, 'Dining hall ID (hallId) is required');
    }

    const diningHall = await diningHallRepository.findById(hallId);
    if (!diningHall) {
      throw new ApiError(404, 'Associated dining hall not found');
    }

    if (!diningHall.isActive) {
      throw new ApiError(400, 'Cannot report incident for an inactive dining hall');
    }

    const payload = {
      studentId: studentUser._id,
      hallId: diningHall._id,
      mealType: reportData.mealType,
      category: reportData.category,
      severity: reportData.severity || 'Low',
      description: reportData.description,
      imageUrl: reportData.imageUrl || '',
      status: INCIDENT_STATUSES.SUBMITTED,
      assignedInspectorId: null,
      inspectorNote: '',
      resolvedAt: null
    };

    return await incidentReportRepository.create(payload);
  }

  async getReportById(id, requestingUser) {
    const report = await incidentReportRepository.findById(id);
    if (!report) {
      throw new ApiError(404, 'Incident report not found');
    }

    // Role-based visibility check
    if (requestingUser.role === USER_ROLES.STUDENT) {
      const studentId = report.studentId?._id
        ? report.studentId._id.toString()
        : report.studentId?.toString();
      if (studentId !== requestingUser._id.toString()) {
        throw new ApiError(403, 'Access denied: You can only view your own incident reports');
      }
    }

    return report;
  }

  async getAllReports(requestingUser, filters = {}, options = {}) {
    const query = {};

    // 1. Role scoping
    if (requestingUser.role === USER_ROLES.STUDENT) {
      query.studentId = requestingUser._id;
    } else if (requestingUser.role === USER_ROLES.INSPECTOR) {
      const assignedHalls = (requestingUser.assignedHalls || []).map((h) =>
        h._id ? h._id.toString() : h.toString()
      );

      if (filters.hallId) {
        if (!assignedHalls.includes(filters.hallId.toString())) {
          throw new ApiError(403, 'Access denied: You are not assigned to this dining hall');
        }
        query.hallId = filters.hallId;
      } else {
        query.hallId = { $in: assignedHalls };
      }
    } else if (filters.hallId) {
      query.hallId = filters.hallId;
    }

    // 2. Additional filters
    if (filters.status) query.status = filters.status;
    if (filters.severity) query.severity = filters.severity;
    if (filters.mealType) query.mealType = filters.mealType;
    if (filters.category) query.category = filters.category;
    if (filters.assignedInspectorId) query.assignedInspectorId = filters.assignedInspectorId;

    const reports = await incidentReportRepository.findAll(query, options);
    const total = await incidentReportRepository.count(query);

    return { reports, total };
  }

  async transitionStatus(reportId, targetStatus, payload = {}, inspectorOrAdminUser) {
    const report = await incidentReportRepository.findById(reportId);
    if (!report) {
      throw new ApiError(404, 'Incident report not found');
    }

    // Invariant 4: Immutable Terminal States
    if (TERMINAL_STATUSES.includes(report.status)) {
      throw new ApiError(
        400,
        `Cannot mutate report: Current status '${report.status}' is terminal and permanently frozen.`
      );
    }

    // Invariant 1: Strict State Machine Transitions
    const allowedTransitions = VALID_STATUS_TRANSITIONS[report.status] || [];
    if (!allowedTransitions.includes(targetStatus)) {
      throw new ApiError(
        400,
        `Invalid status transition: Cannot transition from '${report.status}' to '${targetStatus}'. Allowed: [${allowedTransitions.join(', ')}]`
      );
    }

    // Inspector hall assignment authorization
    if (inspectorOrAdminUser.role === USER_ROLES.INSPECTOR) {
      const reportHallId = report.hallId?._id
        ? report.hallId._id.toString()
        : report.hallId?.toString();
      const assignedHalls = (inspectorOrAdminUser.assignedHalls || []).map((h) =>
        h._id ? h._id.toString() : h.toString()
      );

      if (!assignedHalls.includes(reportHallId)) {
        throw new ApiError(
          403,
          'Access denied: You are not assigned as inspector for this dining hall'
        );
      }
    }

    const updates = { status: targetStatus };

    // Invariant 3: Automatic Inspector Binding on UNDER_REVIEW
    if (targetStatus === INCIDENT_STATUSES.UNDER_REVIEW) {
      updates.assignedInspectorId = inspectorOrAdminUser._id;
    }

    // Invariant 2: Mandatory Remediation Notes on terminal states
    if (
      targetStatus === INCIDENT_STATUSES.ACTION_TAKEN ||
      targetStatus === INCIDENT_STATUSES.DISMISSED
    ) {
      const note = payload.inspectorNote || report.inspectorNote;
      if (!note || !note.trim()) {
        throw new ApiError(
          400,
          `Mandatory note required: An inspectorNote must be provided when transitioning to '${targetStatus}'`
        );
      }
      updates.inspectorNote = note.trim();

      if (targetStatus === INCIDENT_STATUSES.ACTION_TAKEN) {
        updates.resolvedAt = new Date();
      }
    }

    return await incidentReportRepository.updateById(reportId, updates);
  }

  async deleteReport(id, requestingUser) {
    if (requestingUser.role !== USER_ROLES.ADMIN) {
      throw new ApiError(403, 'Access denied: Only administrators can delete incident reports');
    }

    const report = await incidentReportRepository.deleteById(id);
    if (!report) {
      throw new ApiError(404, 'Incident report not found');
    }
    return report;
  }
}

module.exports = new IncidentReportService();
