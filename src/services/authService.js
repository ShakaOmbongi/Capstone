require('dotenv').config(); // Load environment variables

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../entities/User'); // User model

const SECRET_KEY = process.env.JWT_SECRET; // Ensure it's loaded from .env

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in .env!"); // Prevent running without a secret key
}

class AuthService {
  /**
   * Logs in a user by validating their credentials and generating a token.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} role - The user's role (e.g., STUDENT, TUTOR, ADMIN).
   * @returns {string} A JWT token for the user.
   * @throws {Error} If authentication fails.
   */
  async login(email, password, role) {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user's role matches
    if (user.role !== role) {
      throw new Error('Unauthorized role');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Uses .env or default to 1h
    );

    return token;
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   *
   * @param {string} token - The JWT token to verify.
   * @returns {Object} The decoded token payload.
   * @throws {Error} If the token is invalid or expired.
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();
