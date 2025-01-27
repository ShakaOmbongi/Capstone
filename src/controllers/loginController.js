const authService = require('../services/authService');

// Handles student login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password, 'STUDENT');
    res.status(200).json({ message: 'Student logged in successfully', token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Handles tutor login
exports.loginTutor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password, 'TUTOR');
    res.status(200).json({ message: 'Tutor logged in successfully', token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Handles admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password, 'ADMIN');
    res.status(200).json({ message: 'Admin logged in successfully', token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
