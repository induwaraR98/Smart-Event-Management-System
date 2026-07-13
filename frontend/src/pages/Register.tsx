import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone) || phone.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ username, password, email, phoneNumber });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different username or email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold font-outfit text-white">Create Account</h2>
          <p className="text-sm text-slate-400">Join SmartEvents to browse and book tickets instantly</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-semibold mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Username</label>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <User className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Email Address</label>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <Mail className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Phone Number</label>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <Phone className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Password</label>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <Lock className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Confirm Password</label>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <Lock className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
