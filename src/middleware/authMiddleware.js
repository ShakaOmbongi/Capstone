const authService = require('../services/authService');//import

exports.authenticateJWT = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null);

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
