import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Shield, Calendar, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Session timer: default to 1 hour (3600 seconds)
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    // Tick down session time
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSessionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSessionTimeout = async () => {
    alert('Your secure session has expired. You will be logged out.');
    await logout();
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full glass-panel border-t-0 border-x-0 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">
            SecureAuth
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Session: <span className="text-indigo-200 font-mono">{formatTime(timeLeft)}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6 animate-fadeIn">
        {/* Welcome Section */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Workspace Dashboard</span>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mt-1">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              You are currently logged into the protected client dashboard.
            </p>
          </div>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold py-3 px-5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 active:scale-[0.98] self-start md:self-auto"
            >
              <ShieldAlert className="w-4.5 h-4.5" />
              Go to Admin Dashboard
            </Link>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-white">Profile Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">User Name</span>
                <span className="text-slate-200 font-semibold text-sm mt-1 block">{user?.name}</span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Email Address</span>
                <span className="text-slate-200 font-semibold text-sm mt-1 block flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {user?.email}
                </span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Access Level</span>
                <span className="mt-1 block">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                    user?.role === 'admin' 
                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' 
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </span>
                </span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Registered On</span>
                <span className="text-slate-200 font-semibold text-sm mt-1 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {formatDate(user?.createdAt || user?.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Security Stats Side Panel */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg text-white">Security Status</h2>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Password Hashing</span>
                    <span className="text-[11px] text-slate-500">Secured via bcrypt adaptive salt rounds (12).</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">JWT Authentication</span>
                    <span className="text-[11px] text-slate-500">Cryptographically signed JSON Web Token.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">HTTP-Only Protection</span>
                    <span className="text-[11px] text-slate-500">Cookie cookie is sandboxed against XSS scripting.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                If you clear your browser cookies, your session will immediately terminate and you will need to re-authenticate.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
