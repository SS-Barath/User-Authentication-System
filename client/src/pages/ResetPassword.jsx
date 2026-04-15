import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min. 8 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain an uppercase letter';
    else if (!/[a-z]/.test(form.password)) errs.password = 'Must contain a lowercase letter';
    else if (!/[0-9]/.test(form.password)) errs.password = 'Must contain a number';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Invalid or missing reset token.');
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await resetPassword(token, form.password);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link expired or invalid. Request a new one.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">Invalid reset link. Please request a new one.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="stagger-2 mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-white/40">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="stagger-3">
          <InputField
            label="New password"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
            placeholder="Min. 8 characters"
            error={errors.password}
            icon={<LockIcon />}
            autoComplete="new-password"
          />
        </div>

        <div className="stagger-4">
          <InputField
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
            placeholder="Re-enter your new password"
            error={errors.confirmPassword}
            icon={<LockIcon />}
            autoComplete="new-password"
          />
        </div>

        <div className="stagger-5">
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
                Updating...
              </>
            ) : (
              <>
                Update password
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}