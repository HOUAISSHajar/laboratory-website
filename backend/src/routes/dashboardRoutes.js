const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(auth);

// Get dashboard data
router.get('/', dashboardController.getDashboardData);

// Get user's recent activity
router.get('/activity', dashboardController.getUserActivity);

module.exports = router;