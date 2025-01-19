
const Message = require('../models/Message');

const messageController = {
    // Send a message
    sendMessage: async (req, res) => {
        try {
            const message = new Message({
                sender: req.user.userId,
                receiver: req.body.receiverId,
                subject: req.body.subject,
                content: req.body.content
            });
            
            await message.save();
            await message.populate('sender receiver', 'firstName lastName email');
            
            res.status(201).json(message);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get inbox messages
    getInboxMessages: async (req, res) => {
        try {
            const messages = await Message.find({ receiver: req.user.userId })
                .populate('sender', 'firstName lastName email')
                .sort({ createdAt: -1 });
            
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get sent messages
    getSentMessages: async (req, res) => {
        try {
            const messages = await Message.find({ sender: req.user.userId })
                .populate('receiver', 'firstName lastName email')
                .sort({ createdAt: -1 });
            
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Mark message as read
    markAsRead: async (req, res) => {
        try {
            const message = await Message.findById(req.params.id);
            
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }

            if (message.receiver.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            message.isRead = true;
            await message.save();
            
            res.json(message);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = messageController;