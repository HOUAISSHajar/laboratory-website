const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, authorize } = require('../middleware/auth');
const uploadDocument = require('../middleware/documentUpload');

// Apply auth middleware to all routes
router.use(auth);

// Get all projects - accessible by all authenticated users
router.get('/', projectController.getAllProjects);

// Upload document to project
router.post('/:id/documents', 
    uploadDocument.single('document'), 
    projectController.uploadDocument
);

// Delete document
router.delete('/:projectId/documents/:documentId', 
    projectController.deleteDocument
);

// Get project by ID - accessible by all authenticated users
router.get('/:id', projectController.getProjectById);

// Create project - only administrators and faculty researchers and phd_researcher can create projects
router.post('/', authorize(['administrator', 'faculty_researcher', 'phd_researcher']), projectController.createProject);

// Update project - administrators, faculty researchers, and project members can update
router.put('/:id', projectController.updateProject);

// Delete project - only administrators can delete projects
router.delete('/:id', authorize(['administrator']), projectController.deleteProject);

module.exports = router;