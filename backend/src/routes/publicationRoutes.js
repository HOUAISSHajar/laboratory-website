const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const { auth, authorize } = require('../middleware/auth');

// User-specific publications route - requires authentication
router.get('/user', auth, publicationController.getUserPublications);

// Search publications - public access
router.get('/search', publicationController.searchPublications);

// Get all publications - requires authentication for role-based filtering
router.get('/', auth, publicationController.getAllPublications);

// Get publication by ID - public access
router.get('/:id', publicationController.getPublicationById);

// Protected routes below - require authentication
router.use(auth);

// Create publication - only faculty researchers, PhD researchers and administrators
router.post('/', 
    authorize(['administrator', 'faculty_researcher', 'phd_researcher']),
    publicationController.createPublication
);

// Update publication - authors and administrators only
router.put('/:id', publicationController.updatePublication);

// Delete publication - administrators only
router.delete('/:id',
    authorize(['administrator']),
    publicationController.deletePublication
);

module.exports = router;