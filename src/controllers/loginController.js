const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const { User, Role } = require('../entities');

const loginController = {
  async loginStudent(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
      });

      if (!user || !user.role || user.role.name !== 'STUDENT') {
        return res.status(404).send('Student not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials');
      }

      const token = authService.generateToken(user);
      res.cookie('token', token, { httpOnly: true });
      res.cookie('username', user.username);

      return res.redirect('/student/studentdashboard');
    } catch (error) {
      console.error('Student login error:', error);
      return res.status(500).send(`Server error: ${error.message}`);
    }
  },

  async loginTutor(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
      });

      if (!user || !user.role || user.role.name !== 'TUTOR') {
        return res.status(404).send('Tutor not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials');
      }

      const token = authService.generateToken(user);
      res.cookie('token', token, { httpOnly: true });
      res.cookie('username', user.username);

      return res.redirect('/tutor/tutordashboard');
    } catch (error) {
      console.error('Tutor login error:', error);
      return res.status(500).send(`Server error: ${error.message}`);
    }
  }
};

module.exports = loginController;
