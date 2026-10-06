import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const API_BASE = 'http://localhost:5007';

export default function AdminGuard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/40 text-sm">Loading...</span>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
