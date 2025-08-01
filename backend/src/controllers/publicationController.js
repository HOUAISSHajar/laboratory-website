const Publication = require('../models/Publication');

const publicationController = {
    // Create new publication
    createPublication: async (req, res) => {
        try {
            // Add current user as an author
            const publication = new Publication({
                ...req.body,
                authors: [...req.body.authors, req.user.userId]
            });
            
            await publication.save();
            await publication.populate('authors', 'firstName lastName email');
            
            res.status(201).json(publication);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all publications with role-based filtering
    getAllPublications: async (req, res) => {
        try {
            const { year, type } = req.query;
            const { userId, role } = req.user || {};
            let query = {};
            
            // Apply filters if provided
            if (year) query.year = year;
            if (type) query.type = type;
            
            // Role-based filtering
            if (role === 'administrator' || role === 'associated_member') {
                // Admin and associated members see all publications
                // No additional filtering needed
            } else if (role === 'faculty_researcher' || role === 'phd_researcher') {
                // Faculty and PhD researchers see only their publications
                query.authors = userId;
            }
            
            const publications = await Publication.find(query)
                .populate('authors', 'firstName lastName email')
                .sort({ year: -1, createdAt: -1 });
            
            res.json(publications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get publication by ID
    getPublicationById: async (req, res) => {
        try {
            const publication = await Publication.findById(req.params.id)
                .populate('authors', 'firstName lastName email');
                
            if (!publication) {
                return res.status(404).json({ message: 'Publication not found' });
            }
            
            res.json(publication);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Search publications
    searchPublications: async (req, res) => {
        try {
            const { query } = req.query;
            
            const publications = await Publication.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { keywords: { $regex: query, $options: 'i' } },
                    { abstract: { $regex: query, $options: 'i' } }
                ]
            }).populate('authors', 'firstName lastName email');
            
            res.json(publications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update publication
    updatePublication: async (req, res) => {
        try {
            const publication = await Publication.findById(req.params.id);
            
            if (!publication) {
                return res.status(404).json({ message: 'Publication not found' });
            }

            // Check if user is an author or administrator
            if (!publication.authors.includes(req.user.userId) && 
                req.user.role !== 'administrator') {
                return res.status(403).json({ 
                    message: 'Not authorized to update this publication' 
                });
            }

            const updatedPublication = await Publication.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            ).populate('authors', 'firstName lastName email');
            
            res.json(updatedPublication);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete publication
    deletePublication: async (req, res) => {
        try {
            const publication = await Publication.findById(req.params.id);
            
            if (!publication) {
                return res.status(404).json({ message: 'Publication not found' });
            }

            // Only administrators can delete publications
            if (req.user.role !== 'administrator') {
                return res.status(403).json({ 
                    message: 'Not authorized to delete publications' 
                });
            }

            await Publication.findByIdAndDelete(req.params.id);
            res.json({ message: 'Publication deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
     
    // Get user publications with role-based filtering
    getUserPublications: async (req, res) => {
        try {
            const { userId, role } = req.user;
            let query = {};
            
            if (role === 'administrator' || role === 'associated_member') {
                // Admin and associated members see all publications
                // No filtering needed
            } else {
                // Faculty and PhD researchers see only their publications
                query.authors = userId;
            }
            
            const publications = await Publication.find(query)
                .populate('authors', 'firstName lastName email')
                .sort({ year: -1, createdAt: -1 });
            
            res.json(publications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = publicationController;