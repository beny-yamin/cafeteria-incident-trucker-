const express = require('express');
const router = express.Router();
const incidentReportController = require('../controllers/IncidentReportController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  validateCreateIncidentReport,
  validateUpdateStatus,
  validateResolutionNote
} = require('../validators/incidentReportValidator');
const { USER_ROLES } = require('../utils/constants');

// All incident routes require authentication
router.use(authenticate);

// Student Submissions & Queries
router.post(
  '/',
  upload.single('image'),
  validateCreateIncidentReport,
  incidentReportController.createReport
);

router.get('/my-reports', incidentReportController.getMyReports);
router.get('/', incidentReportController.getAllReports);
router.get('/:id', incidentReportController.getReportById);

// Inspector / Admin Lifecycle State Machine Transitions
router.patch(
  '/:id/claim',
  authorize(USER_ROLES.INSPECTOR, USER_ROLES.ADMIN),
  incidentReportController.claimReport
);

router.patch(
  '/:id/resolve',
  authorize(USER_ROLES.INSPECTOR, USER_ROLES.ADMIN),
  validateResolutionNote,
  incidentReportController.resolveReport
);

router.patch(
  '/:id/dismiss',
  authorize(USER_ROLES.INSPECTOR, USER_ROLES.ADMIN),
  validateResolutionNote,
  incidentReportController.dismissReport
);

router.patch(
  '/:id/status',
  authorize(USER_ROLES.INSPECTOR, USER_ROLES.ADMIN),
  validateUpdateStatus,
  incidentReportController.updateReportStatus
);

// Admin Only: Delete Report
router.delete(
  '/:id',
  authorize(USER_ROLES.ADMIN),
  incidentReportController.deleteReport
);

module.exports = router;
