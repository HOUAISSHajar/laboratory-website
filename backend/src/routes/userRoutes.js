const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/imageUpload');

// Apply auth middleware to all routes
router.use(auth);

// Only administrators can get all users
router.get('/', authorize(['administrator','faculty_researcher', 'phd_researcher', 'associated_member']), userController.getAllUsers);

// Get user by ID - accessible to the user themselves and administrators
router.get('/:id', userController.getUserById);

// Create new user - only administrators
router.post('/',
  authorize(['administrator']),
  upload.single('photo'),
  userController.createUser
);

// Update user - administrators and the user themselves
router.put('/:id',
  upload.single('photo'),
  userController.updateUser
);

// Delete user - only administrators
router.delete('/:id',
  authorize(['administrator']),
  userController.deleteUser
);

module.exports = router;