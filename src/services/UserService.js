const bcrypt = require('bcrypt');
const User = require('entities/User'); // User Model

class UserService {
  /**
   * Registers a new user in the system.
   * Ensures unique username and email, and hashes the user's password before saving.
   *
   * @param {Object} userData - The user data (username, email, password, role).
   * @returns {Object} The registered user.
   */
  async registerUser(userData) {
    const { username, email, password, role } = userData;

    if (await this.usernameExists(username)) {
      throw new Error('Username already exists.');
    }

    if (await this.emailExists(email)) {
      throw new Error('Email already exists.');
    }

    const hashedPassword = await this.hashPassword(password);

    return await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      active: true,
      banned: false,
    });
  }

  /**
   * Hashes a password using bcrypt.
   *
   * @param {string} password - The plain text password.
   * @returns {string} The hashed password.
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Checks if a username already exists in the system.
   *
   * @param {string} username - The username to check.
   * @returns {boolean} True if the username exists, false otherwise.
   */
  async usernameExists(username) {
    const user = await User.findOne({ where: { username } });
    return !!user;
  }

  /**
   * Checks if an email already exists in the system.
   *
   * @param {string} email - The email to check.
   * @returns {boolean} True if the email exists, false otherwise.
   */
  async emailExists(email) {
    const user = await User.findOne({ where: { email } });
    return !!user;
  }

  /**
   * Activates a user's account.
   *
   * @param {number} userId - The ID of the user to activate.
   * @returns {Object} The updated user.
   */
  async activateUser(userId) {
    const user = await this.findUserById(userId);
    user.active = true;
    return await user.save();
  }

  /**
   * Deactivates a user's account.
   *
   * @param {number} userId - The ID of the user to deactivate.
   * @returns {Object} The updated user.
   */
  async deactivateUser(userId) {
    const user = await this.findUserById(userId);
    user.active = false;
    return await user.save();
  }

  /**
   * Bans a user.
   *
   * @param {number} userId - The ID of the user to ban.
   * @returns {Object} The updated user.
   */
  async banUser(userId) {
    const user = await this.findUserById(userId);
    user.banned = true;
    user.active = false;
    return await user.save();
  }

  /**
   * Unbans a user.
   *
   * @param {number} userId - The ID of the user to unban.
   * @returns {Object} The updated user.
   */
  async unbanUser(userId) {
    const user = await this.findUserById(userId);
    user.banned = false;
    user.active = true;
    return await user.save();
  }

  /**
   * Updates a user's password.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} oldPassword - The current password.
   * @param {string} newPassword - The new password.
   */
  async updatePassword(userId, oldPassword, newPassword) {
    const user = await this.findUserById(userId);

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Current password is incorrect.');
    }

    user.password = await this.hashPassword(newPassword);
    await user.save();
  }

  /**
   * Finds a user by ID.
   *
   * @param {number} userId - The ID of the user to find.
   * @returns {Object} The user object.
   */
  async findUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  /**
   * Retrieves all users.
   *
   * @returns {Array} A list of all users.
   */
  async findAllUsers() {
    return await User.findAll();
  }
}

module.exports = new UserService();
