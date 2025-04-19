// src/controllers/flaggedUserController.js
'use strict';

const { User } = require('../entities');
const { Op } = require('sequelize');

const flaggedUserController = {
  // 1️⃣ GET /admin/flagged‑users
  async getFlaggedUsers(req, res) {
    try {
      const flaggedUsers = await User.findAll({
        where: {
          flagReason: { [Op.not]: null }
        },
        attributes: ['id', 'username', 'email', 'flagReason', 'suspended']
      });
      return res.status(200).json({ flaggedUsers });
    } catch (error) {
      console.error('Error in getFlaggedUsers:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 2️⃣ PUT /admin/flagged‑users/:id
  async clearFlag(req, res) {
    try {
      const userId = req.params.id;
      await User.update(
        { flagReason: null },
        { where: { id: userId } }
      );
      return res
        .status(200)
        .json({ message: 'Flag cleared successfully' });
    } catch (error) {
      console.error('Error in clearFlag:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 3️⃣ PATCH /admin/flagged‑users/suspend/:id
  async toggleSuspend(req, res) {
    try {
      const userId = req.params.id;
      // expect { suspend: true } or { suspend: false }
      const { suspend } = req.body;
      await User.update(
        { suspended: suspend },
        { where: { id: userId } }
      );
      return res
        .status(200)
        .json({
          message: `User ${suspend ? 'suspended' : 'unsuspended'} successfully`
        });
    } catch (error) {
      console.error('Error in toggleSuspend:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = flaggedUserController;
