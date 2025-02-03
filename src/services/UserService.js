const bcrypt = require('bcrypt');
const User = require('../entities/User');//import

class UserService {
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

  async usernameExists(username) {
    const user = await User.findOne({ where: { username } });
    return !!user;
  }

  async emailExists(email) {
    const user = await User.findOne({ where: { email } });
    return !!user;
  }
}

module.exports = new UserService();
