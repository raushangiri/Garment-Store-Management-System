const express = require('express');
const router = express.Router();
const { createInitialAdmin, checkSetupStatus } = require('../controllers/setupController');

// Public routes - no authentication required
router.get('/status', checkSetupStatus);
router.post('/create-admin', createInitialAdmin);

module.exports = router;
