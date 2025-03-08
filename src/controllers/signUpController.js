'use strict';

const userService = require('../services/UserService');
const Role = require('../entities/Role');

const signUpController = {
  async registerStudent(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
      const studentRole = await Role.findOne({ where: { name: 'STUDENT' } });
      if (!studentRole) return res.status(500).json({ status: 'error', message: 'Student role not found' });
      if (await userService.usernameExists(username)) return res.status(400).json({ status: 'error', message: 'Username already exists' });
      if (await userService.emailExists(email)) return res.status(400).json({ status: 'error', message: 'Email already exists' });
      const user = await userService.registerUser({ username, email, password, roleId: studentRole.id });
      return res.status(201).json({ status: 'success', message: 'Student registered successfully', data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async registerTutor(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
      const tutorRole = await Role.findOne({ where: { name: 'TUTOR' } });
      if (!tutorRole) return res.status(500).json({ status: 'error', message: 'Tutor role not found' });
      if (await userService.usernameExists(username)) return res.status(400).json({ status: 'error', message: 'Username already exists' });
      if (await userService.emailExists(email)) return res.status(400).json({ status: 'error', message: 'Email already exists' });
      const user = await userService.registerUser({ username, email, password, roleId: tutorRole.id });
      return res.status(201).json({ status: 'success', message: 'Tutor registered successfully', data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = signUpController;
