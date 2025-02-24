const authService = require('../services/authService');

exports.authenticateJWT = (req, res, next) => {
  let token = null;

  // Try getting token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Try getting token from Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1]; // Get token from Bearer <token>
  }

  if (!token) {
    console.log("DEBUG: No token provided");
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = authService.verifyToken(token);
    console.log("DEBUG: Decoded Token:", decoded); // Debugging: Check decoded token

    if (!decoded || !decoded.id) {
      console.log("DEBUG: Token does not contain valid user ID");
      return res.status(403).json({ error: 'Invalid token, user ID missing' });
    }

    req.user = decoded; // Attach the decoded user data
    next();
  } catch (error) {
    console.error("DEBUG: Authentication error:", error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
