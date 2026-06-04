import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/** Redirects to login only when a protected page or action is opened. */
export const AuthRequiredRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: 'Sign in to use this feature.',
        }}
      />
    );
  }

  return children;
};

/** @deprecated Use AuthRequiredRoute — kept for any legacy imports */
export const ProtectedRoute = AuthRequiredRoute;

export const GuestRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};
