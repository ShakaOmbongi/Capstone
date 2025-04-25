'use strict';

const { User, Role } = require('../entities'); // Include Role model
const sequelize = require('../../db');
const { Op } = require('sequelize');
const { TutoringSession } = require('../entities'); 
const adminController = {
  // Fetch all users with their roles
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
  async getAllSessions(req, res) {
    try {
      const sessions = await TutoringSession.findAll({
        include: [
          {
            model: User,
            as: 'tutor',
            attributes: ['id', 'username'],
            include: [
              {
                model: Role,
                as: 'role',
                attributes: ['name'] 
              }
            ]
          },
          {
            model: User,
            as: 'student',
            attributes: ['id', 'username'],
            include: [
              {
                model: Role,
                as: 'role',
                attributes: ['name']
              }
            ]
          }
        ]
      });
      
      return res.status(200).json({ sessions });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return res.status(500).json({ error: error.message });
      
    }
  },
  // Fetch daily signup metrics
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
  },

 // Count active sessions
async getActiveSessionCount(req, res) {
  try {
    const [results] = await sequelize.query(`
      SELECT COUNT(*) AS "activeCount"
      FROM tutoring_sessions
      WHERE status = 'accepted' AND "sessionDate" > NOW()
    `);
    const count = results[0]?.activeCount || 0;
    return res.status(200).json({ activeSessions: count });
  } catch (error) {
    console.error("Error fetching active session count:", error);
    return res.status(500).json({ error: error.message });
  }
},

// Count pending feedback
async getPendingFeedbackCount(req, res) {
  try {
    const [results] = await sequelize.query(`
      SELECT COUNT(*) AS "pendingCount"
      FROM feedback
      WHERE rating IS NULL OR comment IS NULL
    `);
    const count = results[0]?.pendingCount || 0;
    return res.status(200).json({ pendingFeedback: count });
  } catch (error) {
    console.error("Error fetching pending feedback count:", error);
    return res.status(500).json({ error: error.message });
  }
}

};

module.exports = adminController;
