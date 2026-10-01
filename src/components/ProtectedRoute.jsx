import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';
import Landing from '../pages/Landing';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for Firebase to resolve the session before making any redirect decision.
  // Without this, the app flashes to /login on every page refresh.
  if (loading) {
    return <LoadingScreen message="Resolving session…" />;
  }

  if (!user) {
    // If the user visits the root website URL "/", show the Landing page
    if (location.pathname === '/') {
      return <Landing />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
