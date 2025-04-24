// src/routes/userRoutes.js
'use strict';

const express  = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { User, UserProfile } = require('../entities');


router.get('/', authenticateJWT, async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { roleId: 8 },                  // only tutors
      attributes: ['id', 'username', 'email', 'roleId', 'profilePic'],
      include: [{
        model: UserProfile,
        as: 'profile',                       // <— must match your association alias
        attributes: ['bio', 'subjects', 'learningstyle']
      }]
    });

    // Flatten profile into top‐level keys
    const payload = users.map(u => ({
      id:  u.id,
      username:  u.username,
      email:  u.email,
      roleId: u.roleId,
      profilePic:    u.profilePic,
      bio:           u.profile?.bio     || '',
      subjects:      u.profile?.subjects|| '',
      learningstyle: u.profile?.learningstyle || ''
    }));

    res.status(200).json({ users: payload });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
