const User = require('../models/User');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const userController = {
  // Create new user
  createUser: async (req, res) => {
    try {
      const { email } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user object
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        department: req.body.department,
        description: req.body.description
      };

      // Add photo if uploaded
      if (req.file) {
        userData.photo = `uploads/user-photos/${req.file.filename}`;
      }

      const user = new User(userData);
      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update basic fields
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.department = req.body.department || user.department;
      user.description = req.body.description || user.description;

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Handle photo upload
      if (req.file) {
        // Delete old photo if exists
        if (user.photo) {
          const oldPhotoPath = path.join(__dirname, '..', user.photo);
          try {
            await fs.unlink(oldPhotoPath);
          } catch (error) {
            console.error('Error deleting old photo:', error);
          }
        }
        user.photo = `/uploads/user-photos/${req.file.filename}`;
      }

      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json(userResponse);
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

      // Delete user's photo if exists
      if (user.photo) {
        const photoPath = path.join(__dirname, '..', user.photo);
        try {
          await fs.unlink(photoPath);
        } catch (error) {
          console.error('Error deleting user photo:', error);
        }
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

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
  }
};

module.exports = userController;