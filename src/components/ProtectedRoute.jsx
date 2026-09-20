import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for Firebase to resolve the session before making any redirect decision.
  // Without this, the app flashes to /login on every page refresh.
  if (loading) {
    return <LoadingScreen message="Resolving session…" />;
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
