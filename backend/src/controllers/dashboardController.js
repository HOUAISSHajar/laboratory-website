const User = require('../models/User');
const Project = require('../models/Project');
const Publication = require('../models/Publication');
const Activity = require('../models/Activity');
const Contact = require('../models/Contact');

const dashboardController = {
    // Get dashboard data based on user role
    getDashboardData: async (req, res) => {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const dashboardData = {};

            // Get user's basic info
            const user = await User.findById(userId).select('-password');
            dashboardData.userInfo = user;

            // Data for administrators
            if (userRole === 'administrator') {
                // Get counts for overview
                dashboardData.counts = {
                    users: await User.countDocuments(),
                    projects: await Project.countDocuments(),
                    publications: await Publication.countDocuments(),
                    activities: await Activity.countDocuments(),
                    newContacts: await Contact.countDocuments({ status: 'new' })
                };

                // Get recent contacts
                dashboardData.recentContacts = await Contact.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('assignedTo', 'firstName lastName');

                // Get recent activities
                dashboardData.recentActivities = await Activity.find()
                    .sort({ date: -1 })
                    .limit(5)
                    .populate('organizers', 'firstName lastName');
            }

            // Data for faculty researchers and PhD researchers
            if (['faculty_researcher', 'phd_researcher'].includes(userRole)) {
                // Get user's projects
                dashboardData.myProjects = await Project.find({
                    members: userId
                })
                .populate('members', 'firstName lastName')
                .sort({ updatedAt: -1 });

                // Get user's publications
                dashboardData.myPublications = await Publication.find({
                    authors: userId
                })
                .sort({ year: -1 });

                // Get user's activities
                dashboardData.myActivities = await Activity.find({
                    $or: [
                        { organizers: userId },
                        { participants: userId }
                    ]
                })
                .sort({ date: -1 });
            }

            // Data for associated members
            if (userRole === 'associated_member') {
                // Get only public information
                dashboardData.recentPublications = await Publication.find()
                    .sort({ year: -1 })
                    .limit(5);
                    
                dashboardData.upcomingActivities = await Activity.find({
                    date: { $gte: new Date() },
                    isArchived: false
                })
                .sort({ date: 1 })
                .limit(5);
            }

            res.json(dashboardData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user's recent activity
    getUserActivity: async (req, res) => {
        try {
            const userId = req.user.userId;
            
            // Get user's recent activities across all entities
            const recentActivity = {
                projects: await Project.find({ members: userId })
                    .sort({ updatedAt: -1 })
                    .limit(5)
                    .select('title updatedAt'),
                    
                publications: await Publication.find({ authors: userId })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select('title year'),
                    
                activities: await Activity.find({
                    $or: [
                        { organizers: userId },
                        { participants: userId }
                    ]
                })
                .sort({ date: -1 })
                .limit(5)
                .select('title date type')
            };

            res.json(recentActivity);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = dashboardController;