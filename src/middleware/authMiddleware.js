'use strict';

const authService = require('../services/authService');

function extractToken(req) {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
  return token;
}

exports.authenticateJWT = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    console.log("DEBUG: No token provided");
    return res.status(403).json({ status: 'error', message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = authService.verifyToken(token);
    console.log("DEBUG: Decoded Token:", decoded);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ status: 'error', message: 'Invalid token, user ID missing' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("DEBUG: Authentication error:", error);
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

exports.authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ status: 'error', message: 'No role information available. Access denied.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};
