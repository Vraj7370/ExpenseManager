import { Link } from 'react-router-dom';
import { Home, LogIn } from 'lucide-react';
import { isAuthenticated } from '../utils/auth';

export const NotFound = () => {
  const loggedIn = isAuthenticated();

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center">
        <p className="text-6xl font-bold text-primary mb-2">404</p>
        <h1 className="text-2xl font-semibold text-slate-950 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8">
          The page you are looking for does not exist or was moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={loggedIn ? '/' : '/login'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-md transition-colors"
          >
            <Home size={18} />
            {loggedIn ? 'Go to Dashboard' : 'Go to Login'}
          </Link>
          {!loggedIn && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-md hover:bg-slate-50"
            >
              <LogIn size={18} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
