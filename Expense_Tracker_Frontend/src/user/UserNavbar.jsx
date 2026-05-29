import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import { UserAvatar } from '../components/UserAvatar';
import { clearAuth } from '../utils/auth';

const navSections = [
  {
    label: 'Main',
    links: [{ name: 'Dashboard', path: '' }],
  },
  {
    label: 'Manage',
    links: [
      { name: 'Add Category', path: 'add-category' },
      { name: 'Categories', path: 'my-categories' },
      { name: 'Add Record', path: 'add-expense' },
      { name: 'Records', path: 'my-expenses' },
      { name: 'Add Budget', path: 'add-budget' },
      { name: 'Budgets', path: 'my-budgets' },
    ],
  },
  {
    label: 'Reports',
    links: [
      { name: 'Category Report', path: 'reports' },
      { name: 'Payment Report', path: 'report1' },
    ],
  },
  {
    label: 'Account',
    links: [
      { name: 'Profile', path: 'user-profile' },
      { name: 'Settings', path: 'settings' },
    ],
  },
];

export const UserNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/user/profile');
      setUser(res.data?.data || null);
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    setSidebarOpen(false);
    loadUser();
  }, [location.pathname, loadUser]);

  useEffect(() => {
    const onFocus = () => loadUser();
    const onProfileUpdated = () => loadUser();
    window.addEventListener('focus', onFocus);
    window.addEventListener('profile-updated', onProfileUpdated);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('profile-updated', onProfileUpdated);
    };
  }, [loadUser]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const linkClasses = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-1 ${
      isActive
        ? 'bg-primary-50 text-primary-800'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-200">
        <span className="text-lg font-semibold text-slate-900 tracking-tight">
          Expense Tracker
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <NavLink
                  key={link.path || 'dashboard'}
                  to={link.path}
                  end={link.path === ''}
                  onClick={() => setSidebarOpen(false)}
                  className={linkClasses}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-200 space-y-2">
        {user && (
          <NavLink
            to="user-profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors"
          >
            <UserAvatar user={user} size="sm" />
            <span className="truncate">{user.firstName || 'Profile'}</span>
          </NavLink>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-muted flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-lg font-semibold text-slate-900 tracking-tight">
            Expense Tracker
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
