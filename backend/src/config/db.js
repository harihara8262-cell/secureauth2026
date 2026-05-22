import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path: database.sqlite in the backend root
const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed default users if table is empty
const checkUsers = db.prepare('SELECT count(*) as count FROM users');
const { count } = checkUsers.get();

if (count === 0) {
  console.log('Seeding database with default users...');
  
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `);

  const adminPasswordHash = bcrypt.hashSync('AdminPass123!', 12);
  const userPasswordHash = bcrypt.hashSync('UserPass123!', 12);

  db.transaction(() => {
    insertUser.run('Admin User', 'admin@example.com', adminPasswordHash, 'admin');
    insertUser.run('Regular User', 'user@example.com', userPasswordHash, 'user');
  })();

  console.log('Database seeding completed successfully.');
}

export default db;
