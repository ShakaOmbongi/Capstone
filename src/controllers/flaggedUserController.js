'use strict';

const { sequelize, User } = require('../entities');
const { Op } = require('sequelize');


const flaggedUserController = {
  //  GET /admin/flagged-users
  async getFlaggedUsers(req, res) {
    try {
      console.log("FLAGGED USERS CONTROLLER HIT");
      const flaggedUsers = await sequelize.query(`
        SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.suspended,
          latest_report."reason" AS "flagReason",
          report_counts.report_count
        FROM users u
        JOIN LATERAL (
          SELECT "reason"
          FROM reports
          WHERE "reportedid" = u.id
          ORDER BY "createdAt" DESC
          LIMIT 1
        ) latest_report ON true
        JOIN LATERAL (
          SELECT COUNT(*) AS report_count
          FROM reports
          WHERE "reportedid" = u.id
        ) report_counts ON true
        WHERE report_counts.report_count >= 1;
      `, { type: sequelize.QueryTypes.SELECT });
      

      console.log("Users found:", flaggedUsers);

      return res.status(200).json({ flaggedUsers });
    } catch (error) {
      console.error('Error in getFlaggedUsers:', error);
      return res.status(500).json({ error: error.message });
    }
  },

async reportUser(req, res) {
  try {
    const userId = req.params.userId;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Reason is required for reporting.' });
    }

    await User.update({ flagReason: reason }, { where: { id: userId } });

    return res.status(200).json({ message: 'User reported successfully.' });
  } catch (error) {
    console.error('Error reporting user:', error);
    return res.status(500).json({ error: error.message });
  }
}
,
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
