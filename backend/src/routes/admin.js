import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import db from '../config/db.js';

const router = express.Router();

// Admin-only dashboard route
router.get('/dashboard', authenticate, requireRole('admin'), (req, res) => {
  try {
    // 1. Get statistics
    const totalUsers = db.prepare('SELECT count(*) as count FROM users').get().count;
    const adminUsers = db.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").get().count;
    const standardUsers = db.prepare("SELECT count(*) as count FROM users WHERE role = 'user'").get().count;

    // 2. Get list of all users
    const allUsers = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();

    return res.status(200).json({
      stats: {
        totalUsers,
        adminUsers,
        standardUsers,
      },
      users: allUsers,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ message: 'Internal server error retrieving admin data.' });
  }
});

export default router;
