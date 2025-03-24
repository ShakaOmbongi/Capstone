'use strict';

const userService = require('../services/UserService');
const Role = require('../entities/Role');
const authService = require('../services/authService');

const signUpController = {
  async registerStudent(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      const eduRegex = /^[\w.-]+@[\w.-]+\.edu$/i;
      if (!eduRegex.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Email must be a .edu address' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
      }
      const studentRole = await Role.findOne({ where: { name: 'STUDENT' } });
      if (!studentRole) {
        return res.status(500).json({ status: 'error', message: 'Student role not found' });
      }
      if (await userService.usernameExists(username)) {
        return res.status(400).json({ status: 'error', message: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ status: 'error', message: 'Email already exists' });
      }
      const user = await userService.registerUser({
        username,
        email,
        password,
        roleId: studentRole.id,
      });
      const token = authService.generateToken({
        id: user.id,
        roleId: studentRole.id,
        role: studentRole.name.toUpperCase()
      });
      res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
      // Redirect to student dashboard where the quiz pop-up will appear
      return res.redirect('/student/studentdashboard');
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async registerTutor(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
      }
      const tutorRole = await Role.findOne({ where: { name: 'TUTOR' } });
      if (!tutorRole) {
        return res.status(500).json({ status: 'error', message: 'Tutor role not found' });
      }
      if (await userService.usernameExists(username)) {
        return res.status(400).json({ status: 'error', message: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ status: 'error', message: 'Email already exists' });
      }
      const user = await userService.registerUser({
        username,
        email,
        password,
        roleId: tutorRole.id,
      });
      const token = authService.generateToken({
        id: user.id,
        roleId: tutorRole.id,
        role: tutorRole.name.toUpperCase()
      });
      res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
      return res.redirect('/tutor/tutordashboard');
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = signUpController;
