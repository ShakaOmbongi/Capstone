// testProfile.js
require('dotenv').config(); // Load env variables
const sequelize = require('./db'); // Adjust path if needed
const { User } = require('./src/entities');


async function testProfile() {
  try {
    const user = await User.findOne({ where: { username: 'CarissaBTest' } });
    console.log("User found:", user ? user.toJSON() : 'No user found');
  } catch (error) {
    console.error("Error testing profile:", error);
  } finally {
    await sequelize.close(); // Close DB connection after test
  }
}

testProfile();
