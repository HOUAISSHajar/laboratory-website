const Project = require('../models/Project');
const fs = require('fs').promises;
const path = require('path');

const projectController = {
    // Create project with members
    createProject: async (req, res) => {
        try {
            // Check if user has permission to create projects
            if (!['administrator', 'faculty_researcher', 'phd_researcher'].includes(req.user.role)) {
                return res.status(403).json({ message: 'Not authorized to create projects' });
            }

            const project = new Project({
                ...req.body,
                members: [...req.body.members, req.user.userId] // Add creator as member
            });
            
            await project.save();
            await project.populate('members', 'firstName lastName email');
            res.status(201).json(project);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all projects with role-based filtering
    getAllProjects: async (req, res) => {
        try {
            const { userId, role } = req.user;
            let query = {};
            
            // Role-based filtering
            if (role === 'administrator' || role === 'associated_member') {
                // Admin and associated members see all projects
                // No additional filtering needed
            } else if (role === 'faculty_researcher' || role === 'phd_researcher') {
                // Faculty and PhD researchers see only projects where they are members
                query.members = userId;
            }
            
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

            // Delete all project documents
            if (project.documents && project.documents.length > 0) {
                for (const doc of project.documents) {
                    try {
                        const filePath = path.join(__dirname, '..', doc.fileUrl);
                        await fs.unlink(filePath);
                    } catch (error) {
                        console.error('Error deleting file:', error);
                    }
                }
            }
    
            await Project.findByIdAndDelete(req.params.id);
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Upload document to project
    uploadDocument: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check if user is a member of the project or an administrator
            if (!project.members.includes(req.user.userId) && req.user.role !== 'administrator') {
                return res.status(403).json({ message: 'Not authorized to upload documents to this project' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const newDocument = {
                title: req.body.title || req.file.originalname,
                fileUrl: `uploads/project-documents/${req.file.filename}`,
                uploadDate: new Date()
            };

            project.documents.push(newDocument);
            await project.save();

            res.json({ 
                message: 'Document uploaded successfully', 
                document: newDocument 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete document
    deleteDocument: async (req, res) => {
        try {
            const project = await Project.findById(req.params.projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check if user is a member of the project or an administrator
            if (!project.members.includes(req.user.userId) && req.user.role !== 'administrator') {
                return res.status(403).json({ message: 'Not authorized to delete documents from this project' });
            }

            const document = project.documents.id(req.params.documentId);
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }

            // Delete physical file
            try {
                const filePath = path.join(__dirname, '..', document.fileUrl);
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting file:', error);
            }

            // Remove document from project
            project.documents.pull(req.params.documentId);
            await project.save();

            res.json({ message: 'Document deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = projectController;