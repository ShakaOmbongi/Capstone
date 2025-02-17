const userService = require('../services/UserService');
const Role = require('../entities/Role'); // Import the Role model

const signUpController = {
  // Register a new student
  async registerStudent(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
      // Find the STUDENT role in the database
      const studentRole = await Role.findOne({ where: { name: 'STUDENT' } });
      console.log("DEBUG: Found student role:", studentRole);
      if (!studentRole) {
        return res.status(500).json({ error: 'Student role not found' });
      }

      // Check if username or email already exists
      if (await userService.usernameExists(username)) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Register the new student using the user service
      const user = await userService.registerUser({
        username,
        email,
        password,
        roleId: studentRole.id,
      });

      return res.status(201).json({ message: 'Student registered successfully', user });
    } catch (error) {
      console.error('Register Student error:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Register a new tutor
  async registerTutor(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
      // Find the TUTOR role in the database
      const tutorRole = await Role.findOne({ where: { name: 'TUTOR' } });
      console.log("DEBUG: Found tutor role:", tutorRole);
      if (!tutorRole) {
        return res.status(500).json({ error: 'Tutor role not found' });
      }

      // Check if username or email already exists
      if (await userService.usernameExists(username)) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Register the new tutor using the user service
      const user = await userService.registerUser({
        username,
        email,
        password,
        roleId: tutorRole.id,
      });

      return res.status(201).json({ message: 'Tutor registered successfully', user });
    } catch (error) {
      console.error('Register Tutor error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = signUpController;
