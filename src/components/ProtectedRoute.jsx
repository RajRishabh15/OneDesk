import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for Firebase to resolve the session before making any redirect decision.
  // Without this, the app flashes to /login on every page refresh.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090715]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 animate-pulse" />
          <p className="text-xs text-stone-500 tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
