const Activity = require('../models/Activity');

const activityController = {
    // Create new activity
    createActivity: async (req, res) => {
        try {
            const activity = new Activity({
                ...req.body,
                organizers: [...req.body.organizers, req.user.userId]
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

    // Get all activities
    getAllActivities: async (req, res) => {
        try {
            const { type, isArchived } = req.query;
            let query = {};
            
            // Apply filters if provided
            if (type) query.type = type;
            if (isArchived !== undefined) query.isArchived = isArchived;
            
            const activities = await Activity.find(query)
                .populate('organizers', 'firstName lastName email')
                .populate('participants', 'firstName lastName email')
                .sort({ date: -1 });
            
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

    // Archive/Unarchive activity
    toggleArchiveActivity: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id);
            
            if (!activity) {
                return res.status(404).json({ message: 'Activity not found' });
            }

            // Only organizers and administrators can archive/unarchive
            if (!activity.organizers.includes(req.user.userId) && 
                req.user.role !== 'administrator') {
                return res.status(403).json({ 
                    message: 'Not authorized to archive/unarchive this activity' 
                });
            }

            activity.isArchived = !activity.isArchived;
            await activity.save();
            
            res.json({ 
                message: `Activity ${activity.isArchived ? 'archived' : 'unarchived'} successfully`,
                isArchived: activity.isArchived
            });
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
    }
};

module.exports = activityController;