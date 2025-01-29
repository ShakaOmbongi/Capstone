const userService = require('../services/UserService');

exports.registerStudent = async (req, res) => {
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

    const user = await userService.registerUser({ username, email, password, role: 'STUDENT' });
    res.status(201).json({ message: 'Student registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
