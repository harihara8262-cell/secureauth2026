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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500 tracking-wider">
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
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
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
            <h1 className="text-2xl font-extrabold text-slate-950">
              System Administration
            </h1>
            <p className="text-slate-600 text-xs mt-1">
              Monitor active users, view registration metrics, and verify role configurations.
            </p>
          </div>
          <button
            onClick={() => fetchAdminData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-150 shadow-sm"
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
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Accounts</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{data.stats.totalUsers}</h3>
              </div>
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-md">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Admin Users */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Administrators</span>
                <h3 className="text-3xl font-extrabold text-purple-600 mt-1">{data.stats.adminUsers}</h3>
              </div>
              <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {/* Standard Users */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Standard Users</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{data.stats.standardUsers}</h3>
              </div>
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-md">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              User Directory
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Live SQLite Connection
            </span>
          </div>

          <div className="overflow-x-auto">
            {data.users.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No users found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {data.users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-slate-50 transition-colors duration-100"
                    >
                      <td className="py-4 px-6 font-mono text-slate-500 text-xs">#{user.id}</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-purple-50 border border-purple-200 text-purple-700' 
                            : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                        }`}>
                          {user.role === 'admin' ? 'admin' : 'user'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
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
