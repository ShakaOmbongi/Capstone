'use strict';

const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // Validate input.
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  
  // Ensure environment variables are present.
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    console.error("Missing admin credentials or JWT_SECRET in environment variables.");
    return res.status(500).json({ error: "Server configuration error." });
  }
  
  // Compare credentials against environment variables.
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    try {
      // Create a JWT payload with admin role.
      const payload = {
        id: 'admin', // hard-coded admin id
        username,
        role: 'admin'
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Store the token in a cookie.
      res.cookie('token', token, {
        httpOnly: false, // Consider setting to true for better security if possible
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error signing JWT:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
  
  // If credentials don't match.
  return res.status(401).json({ error: "Invalid admin credentials" });
};
