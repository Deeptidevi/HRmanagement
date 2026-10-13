const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'amahr_enterprise_jwt_super_secret_key_2026';

// Middleware to verify JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is HR_ADMIN
const requireHRAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'HR_ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: HR Administrator privileges required.' });
  }
};

module.exports = {
  authenticateToken,
  requireHRAdmin,
  JWT_SECRET,
};
