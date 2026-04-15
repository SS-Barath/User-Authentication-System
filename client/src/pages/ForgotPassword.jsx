import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email');

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="stagger-2 mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
          Forgot password?
        </h1>
        <p className="text-sm text-white/40">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/60 text-sm mb-6">
            If <span className="text-indigo-400">{email}</span> is registered, you'll receive a reset link shortly.
          </p>
          <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            ← Back to Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="stagger-3">
            <InputField
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              error={error}
              icon={<MailIcon />}
              autoComplete="email"
            />
          </div>

          <div className="stagger-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-shimmer text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : 'Send reset link'}
            </button>
          </div>

          <p className="text-center text-sm text-white/30">
            <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              ← Back to Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}