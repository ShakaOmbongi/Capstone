// src/routes/userRoutes.js
'use strict';

const express       = require('express');
const router        = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { User, UserProfile } = require('../entities');

router.get('/', authenticateJWT, async (req, res, next) => {
  try {
    const { role } = req.query;      
    const where = {};
    if (role === 'tutor') {
      where.roleId = 8;               // only tutors
    } else if (role === 'student') {
      where.roleId = 7;               // only students
    }

    // 2) Fetch users, including their profile
    const users = await User.findAll({
      where,
      attributes: ['id','username','email','roleId','profilePic'],
      include: [{
        model: UserProfile,
        as: 'profile',                
        attributes: ['bio','subjects','learningstyle','availability']
      }]
    });

    // 3) Flatten profile onto top‐level keys for easier front-end use
    const payload = users.map(u => ({
      id:            u.id,
      username:      u.username,
      email:         u.email,
      roleId:        u.roleId,
      profilePic:    u.profilePic,
      bio:           u.profile?.bio           || '',
      subjects:      u.profile?.subjects      || '',
      learningstyle: u.profile?.learningstyle || '',
      availability:  u.profile?.availability  || ''
    }));

    res.status(200).json({ users: payload });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
