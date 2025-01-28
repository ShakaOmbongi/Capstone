const authService = require('../services/authService');

exports.authenticateJWT = (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded; // Attach user data to request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
