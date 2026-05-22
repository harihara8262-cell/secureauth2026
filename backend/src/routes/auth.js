import express from 'express';
import { register, login, logout, me } from '../controllers/auth.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Authentication-protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
