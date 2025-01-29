const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const User = require('../entities/User');

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, role: 'STUDENT' } });

    if (!user) {
      return res.status(404).send('<h1>Student not found</h1>');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('<h1>Invalid credentials</h1>');
    }

    const token = authService.generateToken(user);

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/student/studentdashboard');
  } catch (error) {
    res.status(500).send(`<h1>Server error: ${error.message}</h1>`);
  }
};
