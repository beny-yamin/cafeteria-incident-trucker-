const express = require('express');
const router = express.Router();
const diningHallController = require('../controllers/DiningHallController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const {
  validateCreateDiningHall,
  validateUpdateDiningHall
} = require('../validators/diningHallValidator');
const { USER_ROLES } = require('../utils/constants');

// Public read routes
router.get('/', diningHallController.getAllDiningHalls);
router.get('/:id', diningHallController.getDiningHallById);

// Admin-managed routes
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateCreateDiningHall,
  diningHallController.createDiningHall
);

router.put(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateUpdateDiningHall,
  diningHallController.updateDiningHall
);

router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  diningHallController.deleteDiningHall
);

module.exports = router;
