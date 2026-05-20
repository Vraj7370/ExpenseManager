import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LogOut, Shield, User } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { clearAuth } from '../utils/auth';

export const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const loadProfile = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/user/profile');
      setProfile(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuth();
        navigate('/login', { replace: true });
        return;
      }
      toast.error(error.response?.data?.message || 'Failed to load account details');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const onPasswordSubmit = async () => {
    toast.info('Password change is not available on the server yet. Contact your administrator.');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-xl font-semibold text-slate-700">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">Settings</p>
        <h1 className="text-3xl font-semibold text-slate-950">Account & security</h1>
        <p className="text-slate-500 mt-1">Manage your account and security.</p>
      </div>

      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <User size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-slate-950">Account</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <p><span className="font-medium text-slate-900">Name:</span> {profile?.firstName} {profile?.lastName}</p>
            <p><span className="font-medium text-slate-900">Email:</span> {profile?.email}</p>
            <p><span className="font-medium text-slate-900">Role:</span> {profile?.role || 'User'}</p>
          </div>
          <Link
            to="/user-profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Edit profile
          </Link>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Shield size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-slate-950">Security</h2>
        </div>
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
            <p className="text-sm text-slate-500 mb-2">Update your password (requires server support).</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="currentPassword">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-slate-300'}`}
                {...register('currentPassword', { required: 'Current password is required' })}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="newPassword">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-slate-300'}`}
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmNewPassword">
                Confirm new password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                {...register('confirmNewPassword', { required: 'Please confirm your password' })}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              Update password
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
