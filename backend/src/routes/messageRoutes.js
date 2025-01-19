
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Send a message
router.post('/', messageController.sendMessage);

// Get inbox messages
router.get('/inbox', messageController.getInboxMessages);

// Get sent messages
router.get('/sent', messageController.getSentMessages);

// Mark message as read
router.patch('/:id/read', messageController.markAsRead);

module.exports = router;