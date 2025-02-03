const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clears  JWT 
  res.redirect('/');        // Redirect to login page
});

module.exports = router;
