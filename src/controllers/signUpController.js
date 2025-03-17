'use strict';

const userService = require('../services/UserService');
const Role = require('../entities/Role');
const authService = require('../services/authService');


const signUpController = {
  // -------------------------
  // Register Student
  // -------------------------
  async registerStudent(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validate that the email ends with .edu
      const eduRegex = /^[\w.-]+@[\w.-]+\.edu$/i;
      if (!eduRegex.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Email must be a .edu address' });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
      }

      // Find the STUDENT role in the DB
      const studentRole = await Role.findOne({ where: { name: 'STUDENT' } });
      if (!studentRole) {
        return res.status(500).json({ status: 'error', message: 'Student role not found' });
      }

      // Check if username or email already exist
      if (await userService.usernameExists(username)) {
        return res.status(400).json({ status: 'error', message: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ status: 'error', message: 'Email already exists' });
      }
      
      // Register the new student
      await userService.registerUser({
        username,
        email,
        password,
        roleId: studentRole.id,
      });
      const token = authService.generateToken({ 
        id: user.id, 
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'Strict'
      });

      res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      return res.redirect('/student/studentdashboard');

    } catch (error) {
      // For unexpected errors, return a JSON error response
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // -------------------------
  // Register Tutor
  // -------------------------
  async registerTutor(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
      }

      // Find the TUTOR role in the DB
      const tutorRole = await Role.findOne({ where: { name: 'TUTOR' } });
      if (!tutorRole) {
        return res.status(500).json({ status: 'error', message: 'Tutor role not found' });
      }

      // Check if username or email already exist
      if (await userService.usernameExists(username)) {
        return res.status(400).json({ status: 'error', message: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ status: 'error', message: 'Email already exists' });
      }

      // Register the new tutor
      await userService.registerUser({
        username,
        email,
        password,
        roleId: tutorRole.id,
      });

      // Redirect to a tutor dashboard page
      return res.redirect('/tutor/tutordashboard');

    } catch (error) {
      // For unexpected errors, return a JSON error response
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = signUpController;
