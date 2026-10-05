const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const {
  validateUpdateProfile,
  validateRoleUpdate,
  validateAssignHalls
} = require('../validators/userValidator');
const { USER_ROLES } = require('../utils/constants');

// All user routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', validateUpdateProfile, userController.updateProfile);

// Admin Only routes
router.get('/', authorize(USER_ROLES.ADMIN), userController.getAllUsers);
router.get('/inspectors', authorize(USER_ROLES.ADMIN), userController.getInspectors);
router.patch(
  '/:id/role',
  authorize(USER_ROLES.ADMIN),
  validateRoleUpdate,
  userController.updateUserRole
);
router.patch(
  '/:id/assign-halls',
  authorize(USER_ROLES.ADMIN),
  validateAssignHalls,
  userController.assignHallsToInspector
);

module.exports = router;
