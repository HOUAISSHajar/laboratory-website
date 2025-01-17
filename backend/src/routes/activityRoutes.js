const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { auth, authorize } = require('../middleware/auth');


router.get('/user', auth, activityController.getUserActivities);

// Get all activities - public access
router.get('/', activityController.getAllActivities);

// Get activity by ID - public access
router.get('/:id', activityController.getActivityById);

// Protected routes below - require authentication
router.use(auth);

// Create activity - only faculty researchers and administrators
router.post('/', 
    authorize(['administrator', 'faculty_researcher', 'phd_researcher']),
    activityController.createActivity
);

// Update activity - organizers and administrators only
router.put('/:id', activityController.updateActivity);

// Archive/Unarchive activity - organizers and administrators only
router.patch('/:id/archive', activityController.toggleArchiveActivity);

// Delete activity - administrators only
router.delete('/:id',
    authorize(['administrator']),
    activityController.deleteActivity
);

module.exports = router;