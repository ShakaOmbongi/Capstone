const { Op } = require('sequelize');
const User = require('../entities/User');

class UserRepository {
  /**
   * Finds a user by their username.
   *
   * @param {string} username - The username to search for.
   * @returns {Promise<Object|null>} The user if found, otherwise null.
   */
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  /**
   * Finds a user by their email.
   *
   * @param {string} email - The email to search for.
   * @returns {Promise<Object|null>} The user if found, otherwise null.
   */
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  /**
   * Checks if a user exists with the specified username.
   *
   * @param {string} username - The username to check.
   * @returns {Promise<boolean>} True if the username exists, otherwise false.
   */
  async existsByUsername(username) {
    const count = await User.count({ where: { username } });
    return count > 0;
  }

  /**
   * Checks if a user exists with the specified email.
   *
   * @param {string} email - The email to check.
   * @returns {Promise<boolean>} True if the email exists, otherwise false.
   */
  async existsByEmail(email) {
    const count = await User.count({ where: { email } });
    return count > 0;
  }

  /**
   * Finds all users with a specified role.
   *
   * @param {string} role - The role to filter users by (e.g., "STUDENT", "TUTOR", "ADMIN").
   * @returns {Promise<Array>} A list of users with the specified role.
   */
  async findByRole(role) {
    return await User.findAll({ where: { role } });
  }

  /**
   * Finds all users based on their banned status.
   *
   * @param {boolean} banned - True to find banned users; false to find non-banned users.
   * @returns {Promise<Array>} A list of users matching the banned status.
   */
  async findByBanned(banned) {
    return await User.findAll({ where: { banned } });
  }

  /**
   * Finds all users based on their active status.
   *
   * @param {boolean} active - True to find active users; false to find inactive users.
   * @returns {Promise<Array>} A list of users matching the active status.
   */
  async findByActive(active) {
    return await User.findAll({ where: { active } });
  }

  /**
   * Finds a user by their ID.
   *
   * @param {number} id - The ID of the user to find.
   * @returns {Promise<Object|null>} The user if found, otherwise null.
   */
  async findById(id) {
    return await User.findByPk(id);
  }

  /**
   * Saves a new user or updates an existing user.
   *
   * @param {Object} user - The user object to save.
   * @returns {Promise<Object>} The saved user object.
   */
  async save(user) {
    return await user.save();
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<number>} The number of rows deleted.
   */
  async deleteById(id) {
    return await User.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();
