const jwt = require('jsonwebtoken');//protected pw
require('dotenv').config();

class AuthService {
  /**
   * Generates a JWT token for the given user.
   * @param {Object} user - The user object (should include id, email, and role info if available).
   * @returns {string} - The signed JWT token.
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ? user.role.name : null,  // If role is included via association
    };

    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   * @param {string} token - The JWT token to verify.
   * @returns {Object} - The decoded token payload.
   * @throws {Error} - If the token is invalid or expired.
   */
  verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    return jwt.verify(token, secret);
  }
}

module.exports = new AuthService();
