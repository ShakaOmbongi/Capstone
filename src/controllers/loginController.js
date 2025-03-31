'use strict';

const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const { User, Role } = require('../entities');

const loginController = {
  async loginStudent(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }],
      });

      if (!user || !user.role || user.role.name !== 'STUDENT') {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      // Generate a token from user data
      const token = authService.generateToken({
        id: user.id,
        roleId: user.roleId,
        role: user.role.name.toUpperCase()
      });
      // Store token in an httpOnly cookie
      res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      res.cookie('username', user.username);

      return res.redirect('/student/studentdashboard');
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async loginTutor(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }],
      });

      if (!user || !user.role || user.role.name !== 'TUTOR') {
        return res.status(404).json({ status: 'error', message: 'Tutor not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      const token = authService.generateToken({
        id: user.id,
        roleId: user.roleId,
        role: user.role.name.toUpperCase()
      });
      res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      res.cookie('username', user.username);

<<<<<<< HEAD
      return res.redirect('/tutor/tutordashboard');
=======
      // Tutor redirection—adjust to your tutor dashboard route.
      return res.redirect('/tutoruser/tutordashboard');
>>>>>>> origin/tutorupdate
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = loginController;
