const Project = require('../models/Project');

const projectController = {
    // Update createProject permission
    createProject: async (req, res) => {
        try {
            // Check if user has permission to create projects
            if (!['administrator', 'faculty_researcher', 'phd_researcher'].includes(req.user.role)) {
                return res.status(403).json({ message: 'Not authorized to create projects' });
            }

            const project = new Project({
                ...req.body,
                members: [...req.body.members, req.user.userId]
            });
            await project.save();
            await project.populate('members', 'firstName lastName email');
            res.status(201).json(project);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const { userId, role } = req.user;
            let query = {};
            
            // If user is faculty_researcher or phd_researcher, only show their projects
            if (['faculty_researcher', 'phd_researcher'].includes(role)) {
                query.members = userId;
            }
            // Administrator and associated_member will see all projects (no query filter)
            
            const projects = await Project.find(query)
                .populate('members', 'firstName lastName email')
                .sort({ createdAt: -1 });
            
            res.json(projects);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get project by ID
    getProjectById: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id)
                .populate('members', 'firstName lastName email');
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.json(project);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update project
    updateProject: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check if user is a member of the project or an administrator
            if (!project.members.includes(req.user.userId) && req.user.role !== 'administrator') {
                return res.status(403).json({ message: 'Not authorized to update this project' });
            }

            const updatedProject = await Project.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            ).populate('members', 'firstName lastName email');

            res.json(updatedProject);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete project
    deleteProject: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
    
            // Only administrators can delete projects
            if (req.user.role !== 'administrator') {
                return res.status(403).json({ message: 'Not authorized to delete projects' });
            }
    
            await Project.findByIdAndDelete(req.params.id);
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = projectController;