import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset link. Request a new one from the login page.');
      return;
    }

    try {
      await axios.post('/user/reset-password', {
        token,
        password: data.password,
      });
      setDone(true);
      toast.success('Password reset successfully.');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold text-text-base">Invalid reset link</h2>
          <p className="text-sm text-text-muted">This link is missing or malformed.</p>
          <Link
            to="/forgot-password"
            className="inline-block text-primary font-semibold hover:text-primary-hover"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Expense Tracker</p>
          <h2 className="text-3xl font-semibold text-text-base mb-2">Set new password</h2>
          <p className="text-text-muted">Choose a new password for your account.</p>
        </div>

        {done ? (
          <p className="text-sm text-text-muted">Redirecting you to sign in...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must have at least 6 characters' },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Reset password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-text-muted">
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
