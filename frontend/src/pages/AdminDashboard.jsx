import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { 
  ShieldAlert, Users, Shield, User, Calendar, ArrowLeft, Loader2, RefreshCw 
} from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({ stats: null, users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    setError('');
    try {
      const response = await api.get('/api/admin/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard statistics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-wider">
          Loading secure administrative insights...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full glass-panel border-t-0 border-x-0 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md shadow-purple-500/10">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-200 via-white to-indigo-200 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              System Administration
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Monitor active users, view registration metrics, and verify role configurations.
            </p>
          </div>
          <button
            onClick={() => fetchAdminData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all duration-150"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {/* Stats Grid */}
        {data.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Accounts</span>
                <h3 className="text-3xl font-extrabold text-white mt-1">{data.stats.totalUsers}</h3>
              </div>
              <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shadow-md">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Users */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Administrators</span>
                <h3 className="text-3xl font-extrabold text-purple-400 mt-1">{data.stats.adminUsers}</h3>
              </div>
              <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {/* Standard Users */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Standard Users</span>
                <h3 className="text-3xl font-extrabold text-slate-200 mt-1">{data.stats.standardUsers}</h3>
              </div>
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shadow-md">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/35">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              User Directory
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-900">
              Live SQLite Connection
            </span>
          </div>

          <div className="overflow-x-auto">
            {data.users.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">No users found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-950/20">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
                  {data.users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-slate-900/15 transition-colors duration-100"
                    >
                      <td className="py-4 px-6 font-mono text-slate-400 text-xs">#{user.id}</td>
                      <td className="py-4 px-6 font-semibold text-white">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' 
                            : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                        }`}>
                          {user.role === 'admin' ? 'admin' : 'user'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
