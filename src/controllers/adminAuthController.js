'use strict';
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    try {
      const payload = {
        id: 'admin',
        username,
        role: 'admin'
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error signing JWT:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  return res.status(401).json({ error: "Invalid admin credentials" });
};
