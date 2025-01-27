const userService = require('../../services/userService');

// Handles student registration
exports.registerStudent = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Check if username or email already exists
    if (await userService.usernameExists(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await userService.emailExists(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Register the user as a student
    const user = await userService.registerUser({ username, email, password, role: 'STUDENT' });
    res.status(201).json({ message: 'Student registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handles tutor registration
exports.registerTutor = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    if (await userService.usernameExists(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await userService.emailExists(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await userService.registerUser({ username, email, password, role: 'TUTOR' });
    res.status(201).json({ message: 'Tutor registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
