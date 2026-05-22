import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      icon: <Info className="w-5 h-5 flex-shrink-0" />,
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${currentStyle.bg} transition-all duration-300 animate-fadeIn`}>
      {currentStyle.icon}
      <div className="flex-1 text-sm font-medium leading-5">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-150 focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
