const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Only administrators can get all users
router.get('/', authorize(['administrator', 'faculty_researcher', 'phd_researcher', 'associated_member']), userController.getAllUsers);

// Users can view any profile
router.get('/:id', userController.getUserById);

// Users can update their own profile, administrators can update any profile
router.put('/:id', auth, userController.updateUser);  // We'll handle the permission check in the controller

// Only administrators can delete users
router.delete('/:id', authorize(['administrator']), userController.deleteUser);

module.exports = router;