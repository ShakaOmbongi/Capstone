'use strict';

const { User } = require('../entities');
const bcrypt = require('bcrypt');

const tutorController = {
  async getProfile(req, res) {
    try {
      const tutor = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email'] });
      if (!tutor) return res.status(404).json({ status: 'error', message: 'Tutor not found' });
      res.status(200).json({ status: 'success', message: 'Profile fetched', data: tutor });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { username, email } = req.body;
      if (!username || !email) {
        return res.status(400).json({ status: 'error', message: 'Username and email required' });
      }
      const tutor = await User.findByPk(req.user.id);
      if (!tutor) return res.status(404).json({ status: 'error', message: 'Tutor not found' });
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists && emailExists.id !== tutor.id) {
        return res.status(409).json({ status: 'error', message: 'Email already in use' });
      }
      tutor.username = username;
      tutor.email = email;
      await tutor.save();
      res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: tutor });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ status: 'error', message: 'Both passwords required' });
      }
      const tutor = await User.findByPk(req.user.id);
      if (!tutor) return res.status(404).json({ status: 'error', message: 'Tutor not found' });
      const isMatch = await bcrypt.compare(currentPassword, tutor.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Incorrect current password' });
      }
      tutor.password = await bcrypt.hash(newPassword, 10);
      await tutor.save();
      res.status(200).json({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = tutorController;
