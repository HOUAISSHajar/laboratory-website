const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { auth, authorize } = require('../middleware/auth');

// Public route - anyone can send a contact message
router.post('/', contactController.createContact);

// Protected routes below - require authentication and admin role
router.use(auth, authorize(['administrator']));

// Get all contact messages
router.get('/', contactController.getAllContacts);

// Get contact message by ID
router.get('/:id', contactController.getContactById);

// Update contact status and assignment
router.put('/:id', contactController.updateContact);

// Delete contact message
router.delete('/:id', contactController.deleteContact);

module.exports = router;