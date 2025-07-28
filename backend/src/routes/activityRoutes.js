const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { auth, authorize } = require('../middleware/auth');

// User-specific activities route - requires authentication
router.get('/user', auth, activityController.getUserActivities);

// Get all activities - requires authentication for role-based filtering
router.get('/', auth, activityController.getAllActivities);

// Get activity by ID - requires authentication
router.get('/:id', auth, activityController.getActivityById);

// Protected routes below - require authentication
router.use(auth);

// Create activity - only faculty researchers, PhD researchers and administrators
router.post('/', 
    authorize(['administrator', 'faculty_researcher', 'phd_researcher']),
    activityController.createActivity
);

// Update activity - organizers and administrators only
router.put('/:id', activityController.updateActivity);

// Toggle archive status - organizers and administrators only
router.patch('/:id/toggle-archive', activityController.toggleArchiveStatus);

// Delete activity - administrators only
router.delete('/:id',
    authorize(['administrator']),
    activityController.deleteActivity
);

module.exports = router;