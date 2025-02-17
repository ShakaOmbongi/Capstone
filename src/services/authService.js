const jwt = require('jsonwebtoken'); // JWT library
require('dotenv').config(); // Load env variables

class AuthService {
  // Generate a JWT token for a user
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ? user.role.name : null, // Include role 
    };

    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign(payload, secret, { expiresIn });
  }

  // Verify a JWT token and return its payload
  verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    return jwt.verify(token, secret);
  }
}

module.exports = new AuthService();
