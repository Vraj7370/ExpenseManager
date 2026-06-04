import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axiosInstance';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';
import { toast } from 'react-toastify';

const REMEMBER_EMAIL_KEY = 'rememberedEmail';

export const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      // toastId prevents duplicate toasts (e.g. React StrictMode runs effects twice in dev)
      toast.info(message, { toastId: 'auth-required' });
    }
  }, [location.state?.message]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await axios.post('/user/login', {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (data.rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, data.email.trim().toLowerCase());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      setAuthToken(res.data.token);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">Expense Tracker</p>
          <h2 className="text-3xl font-semibold text-text-base mb-2">Welcome back</h2>
          <p className="text-text-muted">Sign in to continue managing your records.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
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

          <div>
            <label className="block text-sm font-medium text-text-base mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-2.5 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 text-text-base transition-colors ${
                errors.password ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must have at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-white text-primary focus:ring-primary-300 border-slate-300 rounded cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 active:translate-y-px disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
