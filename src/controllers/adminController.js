'use strict';

const { User } = require('../entities'); // Ensure this file exports your User model
const sequelize = require('../../db');        // Import the Sequelize instance from your db file
const { Op } = require('sequelize');

const adminController = {
  // Fetch all users with selected attributes
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'roleId', 'flagReason', 'suspended']
      });
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Fetch flagged users (those with a non-null flagReason)
  async getFlaggedUsers(req, res) {
    try {
      const flaggedUsers = await User.findAll({
        where: {
          flagReason: { [Op.ne]: null }
        },
        attributes: ['id', 'username', 'email', 'flagReason']
      });
      return res.status(200).json({ flaggedUsers });
    } catch (error) {
      console.error("Error fetching flagged users:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Fetch metrics: daily new user signups based on the createdAt column
  async getMetrics(req, res) {
    try {
      const metrics = await User.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
      });
      
      // Format the result into an array of objects
      const dailySignups = metrics.map(item => ({
        date: item.get('date'),
        count: parseInt(item.get('count'), 10)
      }));
      
      return res.status(200).json({ dailySignups });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;
