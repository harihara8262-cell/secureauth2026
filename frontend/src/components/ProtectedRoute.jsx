import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white">
        <div className="relative flex items-center justify-center">
          {/* Subtle spinning accent glow ring */}
          <div className="absolute w-16 h-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin" />
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 tracking-wider animate-pulse">
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the current location they tried to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
