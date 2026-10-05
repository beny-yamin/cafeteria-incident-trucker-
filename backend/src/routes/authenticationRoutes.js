const express = require('express');
const router = express.Router();
// url address of authentication routes is /api/v1/auth  from app.js file 
const authenticationController = require('../controllers/AuthenticationController');
const authenticate = require('../middleware/authenticationMiddleware');

router.post('/sync', authenticationController.verifyAndSyncUser);
router.get('/me', authenticate, authenticationController.getCurrentUser);

module.exports = router;
