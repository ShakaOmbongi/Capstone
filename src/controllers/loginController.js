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

      if (!user || !user.role || user.role.name.toUpperCase() !== 'STUDENT') {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      // Create a plain object payload with only the necessary properties
      const tokenPayload = {
        id: user.id,
        roleId: user.roleId,
        role: user.role.name.toUpperCase()
      };
      const token = authService.generateToken(tokenPayload);

      // Set token cookie (httpOnly true, path: '/')
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/'
      });
      res.cookie('username', user.username, { path: '/' });
      
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

      if (!user || !user.role || user.role.name.toUpperCase() !== 'TUTOR') {
        return res.status(404).json({ status: 'error', message: 'Tutor not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      // Generate token using a plain object payload
      const tokenPayload = {
        id: user.id,
        roleId: user.roleId,
        role: user.role.name.toUpperCase()
      };
      const token = authService.generateToken(tokenPayload);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/'
      });
      res.cookie('username', user.username, { path: '/' });
      
      return res.redirect('/tutor/tutordashboard');
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = loginController;
