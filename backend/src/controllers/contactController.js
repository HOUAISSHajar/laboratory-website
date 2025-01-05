const Contact = require('../models/Contact');

const contactController = {
    // Create new contact message (for public use)
    createContact: async (req, res) => {
        try {
            const contact = new Contact({
                name: req.body.name,
                email: req.body.email,
                subject: req.body.subject,
                message: req.body.message,
                status: 'new'
            });
            
            await contact.save();
            res.status(201).json({
                message: 'Message sent successfully',
                contact: {
                    name: contact.name,
                    email: contact.email,
                    subject: contact.subject,
                    status: contact.status
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all contact messages (admin only)
    getAllContacts: async (req, res) => {
        try {
            const { status } = req.query;
            let query = {};
            
            // Filter by status if provided
            if (status) {
                query.status = status;
            }
            
            const contacts = await Contact.find(query)
                .populate('assignedTo', 'firstName lastName email')
                .sort({ createdAt: -1 });
            
            res.json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get contact by ID (admin only)
    getContactById: async (req, res) => {
        try {
            const contact = await Contact.findById(req.params.id)
                .populate('assignedTo', 'firstName lastName email');
            
            if (!contact) {
                return res.status(404).json({ message: 'Contact message not found' });
            }
            
            res.json(contact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update contact status and assignment (admin only)
    updateContact: async (req, res) => {
        try {
            const { status, assignedTo } = req.body;
            const contact = await Contact.findById(req.params.id);
            
            if (!contact) {
                return res.status(404).json({ message: 'Contact message not found' });
            }

            if (status) contact.status = status;
            if (assignedTo) contact.assignedTo = assignedTo;

            await contact.save();
            await contact.populate('assignedTo', 'firstName lastName email');
            
            res.json(contact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete contact (admin only)
    deleteContact: async (req, res) => {
        try {
            const contact = await Contact.findById(req.params.id);
            
            if (!contact) {
                return res.status(404).json({ message: 'Contact message not found' });
            }

            await Contact.findByIdAndDelete(req.params.id);
            res.json({ message: 'Contact message deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = contactController;