const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, authorize } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all projects - accessible by all authenticated users
router.get('/', projectController.getAllProjects);

// Get project by ID - accessible by all authenticated users
router.get('/:id', projectController.getProjectById);

// Create project - only administrators and faculty researchers can create projects
router.post('/', authorize(['administrator', 'faculty_researcher']), projectController.createProject);

// Update project - administrators, faculty researchers, and project members can update
router.put('/:id', projectController.updateProject);

// Delete project - only administrators can delete projects
router.delete('/:id', authorize(['administrator']), projectController.deleteProject);

module.exports = router;