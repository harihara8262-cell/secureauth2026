import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper to validate password strength
const validatePasswordStrength = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }
  return errors;
};

// Helper for cookie options
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: maxAge,
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  // Password Strength Check
  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ 
      message: 'Password does not meet complexity requirements.', 
      errors: passwordErrors 
    });
  }

  try {
    // Check if user already exists
    const checkUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existingUser = checkUserStmt.get(email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Default registration assigns 'user' role
    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'user')
    `);

    const result = insertStmt.run(name.trim(), email.toLowerCase().trim(), passwordHash);
    
    // Return success
    return res.status(201).json({
      message: 'Account created successfully! You can now log in.',
      userId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user
    const getUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = getUserStmt.get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Determine session expiration
    // If 'rememberMe' is true, session lasts 7 days; otherwise 1 hour
    const tokenDuration = rememberMe ? '7d' : '1h';
    const cookieMaxAge = rememberMe 
      ? 7 * 24 * 60 * 60 * 1000  // 7 days
      : 1 * 60 * 60 * 1000;      // 1 hour

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: tokenDuration }
    );

    // Set cookie
    res.cookie('token', token, getCookieOptions(cookieMaxAge));

    // Return user details (excluding password)
    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};

export const logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  
  return res.status(200).json({ message: 'Logged out successfully.' });
};

export const me = (req, res) => {
  // req.user is populated by the `authenticate` middleware
  return res.status(200).json({
    user: req.user
  });
};
