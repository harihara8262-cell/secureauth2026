import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import Alert from '../components/Alert';
import { LogIn, Loader2, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });
  const [showDemoCreds, setShowDemoCreds] = useState(false);

  // Where to redirect after login (defaults to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo({ type: '', message: '' });
    setLoading(true);

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      setAlertInfo({ type: 'success', message: 'Logged in successfully! Redirecting...' });
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      setAlertInfo({
        type: 'error',
        message: error.message || 'Login failed. Please verify your credentials.'
      });
      setLoading(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    setFormData({
      email,
      password,
      rememberMe: false
    });
    setAlertInfo({ type: 'info', message: `Pre-filled ${email.split('@')[0]} credentials.` });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(99,102,241,0.15)]">
        {/* Decorative corner glows */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs mt-1">Access your secure dashboard</p>
        </div>

        {alertInfo.message && (
          <div className="mb-5">
            <Alert 
              type={alertInfo.type} 
              message={alertInfo.message} 
              onClose={() => setAlertInfo({ type: '', message: '' })} 
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              showStrength={false}
              required={true}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-0"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Expandable Demo Credentials helper panel */}
      <div className="w-full max-w-md border border-slate-800 bg-slate-950/40 rounded-xl p-3.5 transition-all duration-200">
        <button
          onClick={() => setShowDemoCreds(!showDemoCreds)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-150"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            Quick Demo Accounts
          </span>
          {showDemoCreds ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDemoCreds && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs animate-fadeIn">
            <div 
              onClick={() => fillDemoCredentials('user@example.com', 'UserPass123!')}
              className="p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 text-left"
            >
              <div className="font-semibold text-indigo-400">Standard User</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">user@example.com</div>
              <div className="text-[10px] text-slate-500">UserPass123!</div>
            </div>
            <div 
              onClick={() => fillDemoCredentials('admin@example.com', 'AdminPass123!')}
              className="p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 text-left"
            >
              <div className="font-semibold text-purple-400">Admin User</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">admin@example.com</div>
              <div className="text-[10px] text-slate-500">AdminPass123!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
