import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import { UserAvatar } from '../components/UserAvatar';
import { clearAuth } from '../utils/auth';

const navGroups = [
  {
    label: 'Main',
    links: [{ name: 'Dashboard', path: '' }],
  },
  {
    label: 'Categories',
    links: [
      { name: 'Add Category', path: 'add-category' },
      { name: 'Categories', path: 'my-categories' },
    ],
  },
  {
    label: 'Records',
    links: [
      { name: 'Add Record', path: 'add-expense' },
      { name: 'Records', path: 'my-expenses' },
    ],
  },
  {
    label: 'Budgets',
    links: [
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

const pageTitles = {
  '': 'Dashboard',
  'add-category': 'Add Category',
  'my-categories': 'Categories',
  'add-expense': 'Add Record',
  'my-expenses': 'Records',
  'add-budget': 'Add Budget',
  'my-budgets': 'Budgets',
  reports: 'Category Report',
  report1: 'Payment Report',
  'user-profile': 'Profile',
  settings: 'Settings',
};

const sidebarLinkClass = ({ isActive }) =>
  `block rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-1 ${
    isActive
      ? 'bg-primary-50 text-primary-800'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
  }`;

const getPageKey = (pathname) => pathname.replace(/^\//, '').split('/')[0] || '';

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const pageKey = getPageKey(location.pathname);
  const pageTitle = pageTitles[pageKey] || 'Expense Tracker';

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
    setIsOpen(false);
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
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const renderSidebarNav = (onNavigate) => (
    <div className="space-y-3">
      {navGroups.map((group) => (
        <section key={group.label}>
          <p className="px-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.links.map((link) => (
              <NavLink
                key={link.path || 'dashboard'}
                to={link.path}
                end={link.path === ''}
                onClick={onNavigate}
                className={sidebarLinkClass}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  const TopNavbar = ({ showMenuButton = false }) => (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        {showMenuButton ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 lg:hidden"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Menu size={18} />
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Expense Tracker
          </p>
          <h1 className="truncate text-sm font-semibold text-slate-950 sm:text-base">
            {pageTitle}
          </h1>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <NavLink
            to="user-profile"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
            }
          >
            <UserAvatar user={user} size="sm" />
            <span className="hidden sm:inline text-sm font-medium max-w-[8rem] truncate">
              {user?.firstName || 'Profile'}
            </span>
            <span className="sm:hidden text-sm font-medium">Profile</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col lg:flex-row">
      {/* Desktop sidebar — full navigation */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 bg-white border-r border-slate-200">
        <div className="h-14 flex items-center px-4 border-b border-slate-200 shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-950 truncate">Expense Tracker</p>
            <p className="text-[11px] text-slate-500 truncate">All pages</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Sidebar navigation">
          {renderSidebarNav()}
        </nav>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative flex w-[min(17rem,88vw)] flex-col bg-white border-r border-slate-200 shadow-xl">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
              <span className="text-sm font-semibold text-slate-950">Menu</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {renderSidebarNav(() => setIsOpen(false))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main column: top navbar + page content */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-56">
        <TopNavbar showMenuButton />

        <main className="flex-1 w-full py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
