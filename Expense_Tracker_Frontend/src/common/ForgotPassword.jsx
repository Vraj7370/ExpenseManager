import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('/user/forgot-password', {
        email: data.email.trim().toLowerCase(),
      });
      setSubmitted(true);
      toast.success('Check your email for a reset link.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Expense Tracker</p>
          <h2 className="text-3xl font-semibold text-text-base mb-2">Forgot password</h2>
          <p className="text-text-muted">
            Enter your email and we will send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <p className="text-sm text-text-muted">
              If an account exists for that email, you will receive a reset link shortly. The link expires in 1 hour.
            </p>
            <Link
              to="/login"
              className="block w-full text-center bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-text-muted">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
