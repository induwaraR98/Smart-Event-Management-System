import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showExpiredMsg = searchParams.get('expired') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login({ username, password });
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold font-outfit text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400">Sign in to book tickets and manage your events</p>
        </div>

        {showExpiredMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Session expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-semibold mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Username</label>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <Mail className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Password</label>
            </div>
            <div className="flex items-center p-3 rounded-2xl border border-slate-800 bg-slate-900 focus-within:border-indigo-500/50 transition-all">
              <Lock className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
