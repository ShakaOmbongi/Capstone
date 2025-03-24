'use strict';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

module.exports = {
  generateToken: (payload) => {
    console.log("Generating token with payload:", payload);
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  },
  verifyToken: (token) => {
    return jwt.verify(token, JWT_SECRET);
  }
};
