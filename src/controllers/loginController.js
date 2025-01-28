const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const User = require('../entities/User'); // Assuming this is your User entity

// Handles student login
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

    // Generate JWT Token
    const token = authService.generateToken(user);

    // OPTION 1: Backend Redirect
    // ---------------------------------
    // Uncomment this for backend redirection
    res.cookie('token', token, { httpOnly: true }); // Optional: Store the token in a cookie
    res.redirect('/studentdashboard');
    // ---------------------------------

    // OPTION 2: JSON Response for Frontend Handling
    // ---------------------------------
    // Uncomment this for JSON + frontend redirection
    // res.status(200).json({ message: 'Student logged in successfully', token });
    // ---------------------------------
  } catch (error) {
    res.status(500).send(`<h1>Server error: ${error.message}</h1>`);
  }
};
