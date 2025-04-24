// src/controllers/reportController.js
'use strict';

const Report = require('../entities/Report');
const User   = require('../entities/User');  // adjust if you import differently

module.exports.createReport = async (req, res, next) => {
  const reporterId = req.user.id;
  const { reportedId, reason } = req.body;

  if (!reportedId || !reason) {
    return res.status(400).json({ message: 'reportedId and reason are required' });
  }

  try {
    // 1) save the report record
    await Report.create({ reporterId, reportedId, reason });

    // 2) update the user's flagreason so they appear in the flagged-users list
    await User.update(
      { flagreason: reason },
      { where: { id: reportedId } }
    );  // ← use semicolon, not colon

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error('Error creating report:', err);
    next(err);
  }
};
