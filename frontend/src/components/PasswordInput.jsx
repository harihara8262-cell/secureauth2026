import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function PasswordInput({ 
  value, 
  onChange, 
  placeholder = 'Create secure password', 
  id = 'password',
  name = 'password',
  required = true,
  showStrength = false
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-gray-700' });
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const toggleVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!value) {
      setStrength({ score: 0, label: '', color: 'bg-gray-700' });
      setChecks({ length: false, uppercase: false, lowercase: false, number: false, special: false });
      return;
    }

    const testChecks = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };

    setChecks(testChecks);

    const passedCount = Object.values(testChecks).filter(Boolean).length;
    let label = 'Weak';
    let color = 'bg-rose-500';

    if (passedCount >= 5) {
      label = 'Strong';
      color = 'bg-emerald-500';
    } else if (passedCount >= 3) {
      label = 'Medium';
      color = 'bg-amber-500';
    }

    setStrength({ score: passedCount, label, color });
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2 pr-12"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors duration-150 focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-3 pt-1 animate-fadeIn">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Password Strength</span>
              <span className={
                strength.label === 'Strong' ? 'text-emerald-400' :
                strength.label === 'Medium' ? 'text-amber-400' : 'text-rose-400'
              }>{strength.label}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${strength.color} transition-all duration-300`} 
                style={{ width: `${(strength.score / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Detailed Criteria Checklist */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
            <div className="flex items-center gap-1.5">
              {checks.length ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ml-1 mr-1" />
              )}
              <span className={checks.length ? 'text-slate-300 font-semibold' : ''}>8+ Characters</span>
            </div>
            <div className="flex items-center gap-1.5">
              {checks.uppercase ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ml-1 mr-1" />
              )}
              <span className={checks.uppercase ? 'text-slate-300 font-semibold' : ''}>1+ Uppercase (A-Z)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {checks.lowercase ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ml-1 mr-1" />
              )}
              <span className={checks.lowercase ? 'text-slate-300 font-semibold' : ''}>1+ Lowercase (a-z)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {checks.number ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ml-1 mr-1" />
              )}
              <span className={checks.number ? 'text-slate-300 font-semibold' : ''}>1+ Number (0-9)</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              {checks.special ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ml-1 mr-1" />
              )}
              <span className={checks.special ? 'text-slate-300 font-semibold' : ''}>1+ Special Character (!@#$ etc)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
