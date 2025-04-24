// userRoutes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { User } = require('../entities');  

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id','username','email','roleId'],
      order: [['username','ASC']],
    });
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users for report:', err);
    res.status(500).json({ error: 'Unable to load users' });
  }
});

module.exports = router;
