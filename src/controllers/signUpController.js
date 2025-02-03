const userService = require('../services/UserService');
const Role = require('../entities/Role');//import

const signUpController = {
  async registerStudent(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
      const studentRole = await Role.findOne({ where: { name: 'STUDENT' } });
      console.log("DEBUG: Found student role:", studentRole);
      if (!studentRole) {
        return res.status(500).json({ error: 'Student role not found' });
      }

      if (await userService.usernameExists(username)) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }

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

  async registerTutor(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
      const tutorRole = await Role.findOne({ where: { name: 'TUTOR' } });
      console.log("DEBUG: Found tutor role:", tutorRole);
      if (!tutorRole) {
        return res.status(500).json({ error: 'Tutor role not found' });
      }

      if (await userService.usernameExists(username)) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (await userService.emailExists(email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }

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
