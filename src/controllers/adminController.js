// controllers/adminController.js
const { User, sequelize } = require('../entities');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role']
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFlaggedUsers = async (req, res) => {
  try {
    // Assuming a flagged user has a non-null "flagReason" column.
    const flaggedUsers = await User.findAll({
      where: {
        flagReason: {
          [Op.ne]: null
        }
      },
      attributes: ['id', 'username', 'email', 'flagReason']
    });
    res.status(200).json({ flaggedUsers });
  } catch (error) {
    console.error("Error fetching flagged users:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMetrics = async (req, res) => {
  try {
    // This example aggregates daily new user signups based on the createdAt field.
    // Adjust the raw SQL or Sequelize query as needed for your database.
    const metrics = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    const dailySignups = metrics.map(item => ({
      date: item.get('date'),
      count: item.get('count')
    }));
    
    res.status(200).json({ dailySignups });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: error.message });
  }
};
