const authService = require('../services/authService');
const bcrypt = require('bcrypt'); // For pw
const { User, Role } = require('../entities'); // Import 

const loginController = {
  async loginStudent(req, res) {
    const { email, password } = req.body;

    try {
      // Find the user by email with role
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
      });

      console.log("DEBUG: Student login query result:", JSON.stringify(user, null, 2));

      // Check if user exists and has the "STUDENT" role
      if (!user || !user.role || user.role.name !== 'STUDENT') {
        return res.status(404).send('<h1>Student not found</h1>');
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('<h1>Invalid credentials</h1>');
      }

      // Generate sess
      const token = authService.generateToken(user);
      res.cookie('token', token, { httpOnly: true });

    
      res.cookie('username', user.username);

      return res.redirect('/student/studentdashboard');
    } catch (error) {
      console.error('Student login error:', error);
      return res.status(500).send(`<h1>Server error: ${error.message}</h1>`);
    }
  },

  async loginTutor(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
      });

      console.log("DEBUG: Tutor login query result:", JSON.stringify(user, null, 2));

     
      if (!user || !user.role || user.role.name !== 'TUTOR') {
        return res.status(404).send('<h1>Tutor not found</h1>');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('<h1>Invalid credentials</h1>');
      }

      const token = authService.generateToken(user);
      res.cookie('token', token, { httpOnly: true });

      // Also set a cookie for demo
      res.cookie('username', user.username);

      return res.redirect('/tutor/tutordashboard');
    } catch (error) {
      console.error('Tutor login error:', error);
      return res.status(500).send(`<h1>Server error: ${error.message}</h1>`);
    }
  }
};

module.exports = loginController;
