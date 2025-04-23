'use strict';

const { User } = require('../entities');
const { Op } = require('sequelize');

const flaggedUserController = {
  //  GET /admin/flagged-users
  async getFlaggedUsers(req, res) {
    try {
      console.log(" FLAGGED USERS CONTROLLER HIT");

      const flaggedUsers = await User.findAll({
        where: {
          flagReason: { [Op.not]: null }
        },
        attributes: ['id', 'username', 'email', 'flagReason', 'suspended']
      });

      console.log(" Users found:", flaggedUsers.map(user => user.toJSON()));

      return res.status(200).json({ flaggedUsers });
    } catch (error) {
      console.error(' Error in getFlaggedUsers:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  //  PUT /admin/flagged-users/:id
  async clearFlag(req, res) {
    try {
      const userId = req.params.id;
      console.log(`🧹 Clearing flag for user ID: ${userId}`);

      await User.update({ flagReason: null }, { where: { id: userId } });

      return res.status(200).json({ message: 'Flag cleared successfully' });
    } catch (error) {
      console.error('Error in clearFlag:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  //  PATCH /admin/flagged-users/suspend/:id
  async toggleSuspend(req, res) {
    try {
      const userId = req.params.id;
      const { suspend } = req.body;

      console.log(` Toggling suspend for user ID: ${userId}, suspend = ${suspend}`);

      await User.update({ suspended: suspend }, { where: { id: userId } });

      return res.status(200).json({
        message: `User ${suspend ? 'suspended' : 'unsuspended'} successfully`
      });
    } catch (error) {
      console.error(' Error in toggleSuspend:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = flaggedUserController;
