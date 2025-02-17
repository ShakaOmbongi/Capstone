const { Op } = require('sequelize');
const User = require('../entities/User');

// User repository for data operations
class UserRepository {
  // Find a user by username
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  // Find a user by email
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  // Check if a username exists
  async existsByUsername(username) {
    const count = await User.count({ where: { username } });
    return count > 0;
  }

  // Check if an email exists
  async existsByEmail(email) {
    const count = await User.count({ where: { email } });
    return count > 0;
  }

  // Find all users with a specific role
  async findByRole(role) {
    return await User.findAll({ where: { role } });
  }

  // Find all users by banned status
  async findByBanned(banned) {
    return await User.findAll({ where: { banned } });
  }

  // Find all users by active status
  async findByActive(active) {
    return await User.findAll({ where: { active } });
  }

  // Find a user by ID
  async findById(id) {
    return await User.findByPk(id);
  }

  // Save (create/update) a user
  async save(user) {
    return await user.save();
  }

  // Delete a user by ID
  async deleteById(id) {
    return await User.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();
