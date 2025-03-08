'use strict';

const { User } = require('../entities');

const studentController = {
    async getProfile(req, res) {
        try {
            const student = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email'] });
            if (!student) return res.status(404).json({ status: 'error', message: 'Student not found' });
            res.status(200).json({ status: 'success', message: 'Profile fetched', data: student });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    async updateProfile(req, res) {
        try {
            const { username, email } = req.body;
            if (!username || !email) return res.status(400).json({ status: 'error', message: 'Username and email required' });
            const student = await User.findByPk(req.user.id);
            if (!student) return res.status(404).json({ status: 'error', message: 'Student not found' });
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists && emailExists.id !== student.id) return res.status(409).json({ status: 'error', message: 'Email already in use' });
            student.username = username;
            student.email = email;
            await student.save();
            res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: student });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) return res.status(400).json({ status: 'error', message: 'Both passwords required' });
            const student = await User.findByPk(req.user.id);
            if (!student) return res.status(404).json({ status: 'error', message: 'Student not found' });
            const isMatch = await require('bcrypt').compare(currentPassword, student.password);
            if (!isMatch) return res.status(401).json({ status: 'error', message: 'Incorrect current password' });
            student.password = await require('bcrypt').hash(newPassword, 10);
            await student.save();
            res.status(200).json({ status: 'success', message: 'Password changed successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = studentController;
