const bcrypt = require('bcrypt');
const User = require('../entities/User'); // Import User model

class UserService {
  // Register a new user with hashed password
  async registerUser({ username, email, password, roleId }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
      active: true,
      banned: false,
    });
  }

  // Check if a username already exists
  async usernameExists(username) {
    const user = await User.findOne({ where: { username } });
    return !!user;
  }

  // Check if an email already exists
  async emailExists(email) {
    const user = await User.findOne({ where: { email } });
    return !!user;
  }
}

module.exports = new UserService();
