import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const API_BASE = 'http://localhost:5007';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function loginWithGoogle() {
    // সরাসরি backend-এর Google OAuth route-এ নিয়ে যায়, নতুন tab না, একই tab-এ redirect
    window.location.href = `${API_BASE}/auth/google`;
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setUser(data.user);
    return data.user;
  }

  async function signup(name, email, password, phone) {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}