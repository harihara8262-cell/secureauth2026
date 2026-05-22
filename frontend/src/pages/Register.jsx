import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import Alert from '../components/Alert';
import { UserPlus, Loader2, Sparkles } from 'lucide-react';

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear email error when user starts re-typing
    if (name === 'email') {
      setEmailError('');
    }
  };

  // Inline email format validation on input blur
  const handleEmailBlur = () => {
    if (!formData.email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Please enter a valid email address (e.g. user@example.com).');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo({ type: '', message: '' });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlertInfo({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      setAlertInfo({ type: 'error', message: 'Passwords do not match. Please verify.' });
      return;
    }

    setLoading(true);

    try {
      const data = await signup(formData.name, formData.email, formData.password);
      setAlertInfo({ type: 'success', message: data.message });
      
      // Reset form
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setAlertInfo({ 
        type: 'error', 
        message: error.message || 'Registration failed. Please check your inputs.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(99,102,241,0.15)]">
        {/* Decorative corner glows */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3 animate-pulse">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent flex items-center gap-1.5">
            Create Account <Sparkles className="w-4 h-4 text-indigo-400" />
          </h2>
          <p className="text-slate-400 text-xs mt-1">Get started with a secure account</p>
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
            <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2"
              placeholder="John Doe"
            />
          </div>

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
              onBlur={handleEmailBlur}
              required
              className={`w-full px-4 py-3 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2 ${
                emailError ? 'border-rose-500/50 focus:ring-rose-500/30' : ''
              }`}
              placeholder="you@example.com"
            />
            {emailError && (
              <p className="text-rose-400 text-[11px] mt-1 font-medium animate-fadeIn">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create secure password"
              showStrength={true}
              required={true}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Verify password"
              showStrength={false}
              required={true}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
