import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Trust proxy (required for rate limiting behind reverse proxies/tunnels)
app.set('trust proxy', 1);

// Middlewares with dynamic CORS origin matching to support tunnel domains
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin requests (no Origin header) or matching domains
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));

app.use(express.json());
app.use(cookieParser());

// Debug logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Serve static assets in production/deployment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
const indexHtmlPath = path.join(frontendDistPath, 'index.html');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Fallback all other routes to React's index.html (Client-side routing support)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(200).json({
      message: 'SecureAuth API Server is online and running.',
      status: 'active',
      frontend_assets: 'external'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`Allowing requests from: ${CLIENT_URL}`);
  console.log(`========================================`);
});
