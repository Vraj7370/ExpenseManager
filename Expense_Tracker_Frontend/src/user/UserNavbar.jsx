import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Array of links for easy management
  const navLinks = [
    { name: 'Dashboard', path: '' },
    { name: 'Add Category', path: 'add-category' },
    { name: 'Categories', path: 'my-categories' },
    { name: 'Add Record', path: 'add-expense' },
    { name: 'Records', path: 'my-expenses' },
    { name: 'Category Report', path: 'reports' },
    { name: 'Payment Report', path: 'report1' },
    { name: 'Profile', path: 'user-profile' },
    { name: 'Settings', path: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col">
      <nav className="bg-white border-b border-slate-200 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between min-h-16">
          <div className="flex min-w-0">
            {/* Logo */}
            <div className="shrink-0 flex items-center pr-6">
              <span className="text-xl font-semibold text-slate-900 tracking-tight">
                Expense Tracker
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-x-1 sm:gap-y-2 py-3">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  className={({ isActive }) =>
                    `inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-800'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-primary-50 border-primary text-primary-800'
                      : 'border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-950'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      </nav>
      
      {/* Dashboard Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
