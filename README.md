# Secure User Authentication System

A secure, high-fidelity, role-based user authentication system built with **React (Vite)**, **Tailwind CSS v4**, **Node.js (Express)**, and **SQLite**.

This application implements secure, HTTP-only cookie-based JWT sessions, password hashing (bcrypt), brute-force rate-limiting, and client/server-side validation.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite SPA) + Tailwind CSS v4 + Lucide Icons + Axios
* **Backend**: Node.js + Express.js
* **Database**: SQLite (via the high-performance `better-sqlite3` driver)
* **Authentication**: JSON Web Token (JWT) + HTTP-Only Secure Cookies
* **Password Security**: `bcryptjs` adaptive hashing (12 salt rounds)
* **Rate Limiting**: `express-rate-limit`

---

## 📦 Directory Structure

```text
PASSWORD AUTH/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # SQLite database connection & seed logic
│   │   ├── middleware/
│   │   │   ├── auth.js       # JWT validation & role enforcement middleware
│   │   │   └── rateLimit.js  # Brute-force rate limiting (20 reqs / 15 mins)
│   │   ├── controllers/
│   │   │   └── auth.js       # Register, Login, Logout, Session check controllers
│   │   ├── routes/
│   │   │   ├── auth.js       # Authentication endpoints
│   │   │   └── admin.js      # Admin dashboard endpoints
│   │   └── index.js          # Main Express server entrypoint
│   ├── .env                  # Port, environment, CORS config, JWT secrets
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js      # Preconfigured Axios client with cookie support
    │   ├── components/
    │   │   ├── Alert.jsx     # Modern alerts (error, success, warning, info)
    │   │   ├── PasswordInput.jsx # Password input with strength indicator checklist
    │   │   └── ProtectedRoute.jsx # Route guards for authenticated & admin users
    │   ├── context/
    │   │   └── AuthContext.jsx   # Context managing user session lifecycle
    │   ├── pages/
    │   │   ├── Login.jsx     # Modern login interface with demo-creds tray
    │   │   ├── Register.jsx  # Sign-up page with real-time complexity validations
    │   │   ├── Dashboard.jsx # Standard user dashboard area & session timer
    │   │   └── AdminDashboard.jsx # Admin panel showing SQL table list of users
    │   ├── App.jsx           # Routing & provider connections
    │   ├── index.css         # Styling system, Tailwind imports, custom styles
    │   └── main.jsx          # React renderer entrypoint
    ├── vite.config.js        # Vite config + Tailwind v4 + API proxying
    ├── index.html            # Core page layout, SEO description, Google Fonts
    └── package.json
```

---

## 🔒 Implemented Security Features

### 1. HTTP-Only Token Cookies
The JWT token is never stored in `localStorage` or `sessionStorage` on the browser. Instead, the backend sets an `httpOnly`, `SameSite=Lax` cookie. This completely mitigates XSS-based token theft.

### 2. Password Complexity Validator (Bcrypt)
Plain-text passwords are never stored in the database. During registration, passwords are compiled and validated against strict strength rules (minimum 8 characters, casing, numbers, and symbols). If valid, they are salted and hashed with `bcryptjs` (12 rounds) before storage.

### 3. API Rate Limiting
To defend against brute-force attacks, the `/api/auth/login` and `/api/auth/register` endpoints are bound to an `express-rate-limit` middleware, restricting IPs to 20 auth attempts every 15 minutes.

### 4. Role-Based Access Control (RBAC)
Routes are protected on both the frontend and backend. Accessing `/api/admin/dashboard` or `/admin` requires a cryptographically verified token with a role value of `'admin'`. Non-authorized clients are rejected with `403 Forbidden` and redirected.

### 5. Session Expiration & Timeout Handling
Tokens expire after 1 hour. If "Remember Me" is selected at login, token duration is extended to 7 days. The frontend displays a visual countdown timer representing the session validity and auto-logs the user out on zero.

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and `npm` installed.

### 🔌 Running the System Locally

Both servers have already been booted up and are running in the background. You can browse the app immediately at:
👉 **[http://localhost:5173](http://localhost:5173)**

*If you need to start them manually later:*

#### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
*The API server runs on [http://localhost:5000](http://localhost:5000).*

#### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
*The client runs on [http://localhost:5173](http://localhost:5173).*

---

## 🧪 Testing Credentials (Seeded Accounts)

When starting up, the system automatically checks the database and seeds it with two default accounts if empty:

### 👤 Standard User Account
* **Email**: `user@example.com`
* **Password**: `UserPass123!`
* **Access Role**: `user`

### 🔑 Administrator Account
* **Email**: `admin@example.com`
* **Password**: `AdminPass123!`
* **Access Role**: `admin`
