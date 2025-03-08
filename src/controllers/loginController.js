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
      const token = authService.generateToken(user);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      res.cookie('username', user.username);
      return res.status(200).json({ status: 'success', message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
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
      const token = authService.generateToken(user);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      res.cookie('username', user.username);
      return res.status(200).json({ status: 'success', message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = loginController;
