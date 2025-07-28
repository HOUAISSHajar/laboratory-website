const Activity = require('../models/Activity');

const activityController = {
    // Create new activity
    createActivity: async (req, res) => {
        try {
            // Add current user as organizer if not already included
            const organizers = req.body.organizers || [];
            if (!organizers.includes(req.user.userId)) {
                organizers.push(req.user.userId);
            }

            const activity = new Activity({
                ...req.body,
                organizers: organizers
            });
            
            await activity.save();
            await activity.populate([
                { path: 'organizers', select: 'firstName lastName email' },
                { path: 'participants', select: 'firstName lastName email' }
            ]);
            
            res.status(201).json(activity);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all activities with role-based filtering
    getAllActivities: async (req, res) => {
        try {
            const { type, archived } = req.query;
            const { userId, role } = req.user || {};
            let query = {};
            
            // Apply filters if provided
            if (type) query.type = type;
            if (archived !== undefined) {
                query.isArchived = archived === 'true';
            }
            
            // Role-based filtering
            if (role === 'administrator' || role === 'associated_member') {
                // Admin and associated members see all activities
                // No additional filtering needed
            } else if (role === 'faculty_researcher' || role === 'phd_researcher') {
                // Faculty and PhD researchers see only activities they organize
                query.organizers = userId;
            }
            
            const activities = await Activity.find(query)
                .populate('organizers', 'firstName lastName email')
                .populate('participants', 'firstName lastName email')
                .sort({ date: -1, createdAt: -1 });
            
            res.json(activities);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get activity by ID
    getActivityById: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id)
                .populate('organizers', 'firstName lastName email')
                .populate('participants', 'firstName lastName email');
                
            if (!activity) {
                return res.status(404).json({ message: 'Activity not found' });
            }
            
            res.json(activity);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update activity
    updateActivity: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id);
            
            if (!activity) {
                return res.status(404).json({ message: 'Activity not found' });
            }

            // Check if user is an organizer or administrator
            if (!activity.organizers.includes(req.user.userId) && 
                req.user.role !== 'administrator') {
                return res.status(403).json({ 
                    message: 'Not authorized to update this activity' 
                });
            }

            const updatedActivity = await Activity.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            ).populate([
                { path: 'organizers', select: 'firstName lastName email' },
                { path: 'participants', select: 'firstName lastName email' }
            ]);
            
            res.json(updatedActivity);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Toggle archive status
    toggleArchiveStatus: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id);
            
            if (!activity) {
                return res.status(404).json({ message: 'Activity not found' });
            }

            // Check if user is an organizer or administrator
            if (!activity.organizers.includes(req.user.userId) && 
                req.user.role !== 'administrator') {
                return res.status(403).json({ 
                    message: 'Not authorized to archive/unarchive this activity' 
                });
            }

            activity.isArchived = !activity.isArchived;
            await activity.save();
            
            await activity.populate([
                { path: 'organizers', select: 'firstName lastName email' },
                { path: 'participants', select: 'firstName lastName email' }
            ]);
            
            res.json(activity);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete activity
    deleteActivity: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id);
            
            if (!activity) {
                return res.status(404).json({ message: 'Activity not found' });
            }

            // Only administrators can delete activities
            if (req.user.role !== 'administrator') {
                return res.status(403).json({ 
                    message: 'Not authorized to delete activities' 
                });
            }

            await Activity.findByIdAndDelete(req.params.id);
            res.json({ message: 'Activity deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user activities
    getUserActivities: async (req, res) => {
        try {
            const { userId, role } = req.user;
            let query = {};
            
            if (role === 'administrator' || role === 'associated_member') {
                // Admin and associated members see all activities
                // No filtering needed
            } else {
                // Faculty and PhD researchers see only their organized activities
                query.organizers = userId;
            }
            
            const activities = await Activity.find(query)
                .populate('organizers', 'firstName lastName email')
                .populate('participants', 'firstName lastName email')
                .sort({ date: -1, createdAt: -1 });
            
            res.json(activities);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = activityController;