import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/40 text-sm">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
