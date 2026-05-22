import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const authenticate = (req, res, next) => {
  // Read token from HTTP-only cookie or Authorization header
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Fetch user from DB to ensure they still exist and check current role
    const userStmt = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    const user = userStmt.get(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User session invalid. Please log in again.' });
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    next();
  };
};
