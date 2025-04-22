'use strict';

const { User, Role } = require('../entities'); // Include Role model
const sequelize = require('../../db');
const { Op } = require('sequelize');

const adminController = {
  //  Fetch all users with their roles
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'flagReason', 'suspended'],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['name'] 
          }
        ]
      });
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: error.message });
    }
  },


  //  Fetch daily signup metrics
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
