const User = require('../models/User');

const userController = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update user
    updateUser: async (req, res) => {
        try {
            const { firstName, lastName, description, department, researchInterests } = req.body;
            
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.description = description || user.description;
            user.department = department || user.department;
            user.researchInterests = researchInterests || user.researchInterests;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.remove();
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;