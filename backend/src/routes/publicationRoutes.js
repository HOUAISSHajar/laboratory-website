const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const { auth, authorize } = require('../middleware/auth');

//  new route for user-specific publications
router.get('/user', auth, publicationController.getUserPublications);
// Get all publications - public access
router.get('/', publicationController.getAllPublications);

// Search publications - public access
router.get('/search', publicationController.searchPublications);

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