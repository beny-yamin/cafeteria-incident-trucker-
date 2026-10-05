const incidentReportService = require('../services/IncidentReportService');
const ApiResponse = require('../utils/ApiResponse');
const { INCIDENT_STATUSES } = require('../utils/constants');

class IncidentReportController {
  async createReport(req, res, next) {
    try {
      let imageUrl = req.body.imageUrl || '';
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.files && req.files.length > 0) {
        imageUrl = `/uploads/${req.files[0].filename}`;
      }

      const reportData = {
        ...req.body,
        imageUrl
      };

      const report = await incidentReportService.createReport(reportData, req.user);
      return res
        .status(201)
        .json(new ApiResponse(201, report, 'Incident report submitted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllReports(req, res, next) {
    try {
      const { status, category, severity, mealType, hallId, assignedInspectorId } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip = (page - 1) * limit;

      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (severity) filters.severity = severity;
      if (mealType) filters.mealType = mealType;
      if (hallId) filters.hallId = hallId;
      if (assignedInspectorId) filters.assignedInspectorId = assignedInspectorId;

      const result = await incidentReportService.getAllReports(req.user, filters, {
        skip,
        limit
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            ...result,
            page,
            totalPages: Math.ceil(result.total / limit)
          },
          'Incident reports retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const report = await incidentReportService.getReportById(req.params.id, req.user);
      return res
        .status(200)
        .json(new ApiResponse(200, report, 'Incident report details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyReports(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip = (page - 1) * limit;

      const result = await incidentReportService.getAllReports(
        req.user,
        { studentId: req.user._id },
        { skip, limit }
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            ...result,
            page,
            totalPages: Math.ceil(result.total / limit)
          },
          'Your incident reports retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async claimReport(req, res, next) {
    try {
      const report = await incidentReportService.transitionStatus(
        req.params.id,
        INCIDENT_STATUSES.UNDER_REVIEW,
        {},
        req.user
      );
      return res
        .status(200)
        .json(new ApiResponse(200, report, 'Incident report claimed for review'));
    } catch (error) {
      next(error);
    }
  }

  async resolveReport(req, res, next) {
    try {
      const report = await incidentReportService.transitionStatus(
        req.params.id,
        INCIDENT_STATUSES.ACTION_TAKEN,
        req.body,
        req.user
      );
      return res
        .status(200)
        .json(
          new ApiResponse(200, report, 'Incident marked as ACTION_TAKEN with corrective note')
        );
    } catch (error) {
      next(error);
    }
  }

  async dismissReport(req, res, next) {
    try {
      const report = await incidentReportService.transitionStatus(
        req.params.id,
        INCIDENT_STATUSES.DISMISSED,
        req.body,
        req.user
      );
      return res
        .status(200)
        .json(new ApiResponse(200, report, 'Incident report dismissed with explanation note'));
    } catch (error) {
      next(error);
    }
  }

  async updateReportStatus(req, res, next) {
    try {
      const report = await incidentReportService.transitionStatus(
        req.params.id,
        req.body.status,
        req.body,
        req.user
      );
      return res
        .status(200)
        .json(new ApiResponse(200, report, 'Incident report status updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteReport(req, res, next) {
    try {
      await incidentReportService.deleteReport(req.params.id, req.user);
      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Incident report deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IncidentReportController();
