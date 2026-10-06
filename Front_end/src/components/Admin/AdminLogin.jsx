import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5007';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already logged in as admin
  useEffect(() => {
    fetch(`${API_BASE}/admin/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.admin) navigate('/admin', { replace: true });
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/40 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <motion.div className="w-full h-[12vh] bg-[#0a0f0c]" />

      <motion.div className="w-full min-h-[95vh] flex flex-row justify-center items-stretch relative overflow-hidden">
        {/* Left panel — admin dark gold */}
        <motion.div
          className="w-1/2 min-h-full absolute z-0 left-0 flex justify-start items-center pr-4 lg:pr-10"
          style={{ backgroundColor: '#1a1408' }}
        >
          <svg width="60" height="480" viewBox="0 0 60 480" className="opacity-60">
            <g fill="none" stroke="#C9A864" strokeWidth="1">
              <motion.line
                x1="30" y1="0" x2="30" y2="480"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              />
              <motion.circle
                cx="30" cy="240" r="8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 0.5 }}
              />
              <motion.circle
                cx="30" cy="240" r="3"
                fill="#C9A864" stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1 }}
              />
            </g>
          </svg>
        </motion.div>

        {/* Right panel */}
        <motion.div
          className="w-1/2 min-h-full absolute z-0 right-0 flex justify-end items-center pl-4 lg:pl-10"
          style={{ backgroundColor: '#0D1410' }}
        >
          <svg width="60" height="480" viewBox="0 0 60 480" className="opacity-60" style={{ transform: 'scaleX(-1)' }}>
            <g fill="none" stroke="#C9A864" strokeWidth="1">
              <motion.line
                x1="30" y1="0" x2="30" y2="480"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1 }}
              />
              <motion.circle
                cx="30" cy="240" r="8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1.5 }}
              />
            </g>
          </svg>
        </motion.div>

        {/* Center card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[92%] sm:w-[80%] lg:w-[45%] xl:w-[36%] my-6 z-10 bg-[#0a0f0c] rounded-[2rem] border-2 border-[#C9A864]/40 overflow-hidden flex flex-col"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="w-full px-8 sm:px-12 py-14 flex flex-col gap-10">

            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full"
                style={{ border: '1.5px solid #C9A864', backgroundColor: 'rgba(201,168,100,0.08)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A864" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 0.8 }}
                className="text-xs uppercase text-[#C9A864] font-body mb-3 block"
              >
                Admin Panel
              </motion.span>
              <h1
                className="font-heading text-3xl mb-4 bg-clip-text text-transparent bg-[length:200%_100%]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #F0EAD8 0%, #C9A864 25%, #F0EAD8 50%, #C9A864 75%, #F0EAD8 100%)',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                Secure Access
              </h1>
              <motion.div className='w-full flex justify-center items-center'>
                <svg width="120" height="16" viewBox="0 0 120 16" className="opacity-60 mx-auto">
                  <line x1="0" y1="8" x2="45" y2="8" stroke="#C9A864" strokeWidth="1" />
                  <circle cx="60" cy="8" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
                  <line x1="75" y1="8" x2="120" y2="8" stroke="#C9A864" strokeWidth="1" />
                </svg>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.2em] text-[#C9A864] font-body">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-[#0a0f0c] border border-[#F0EAD8]/10 px-5 py-4 text-sm text-[#F0EAD8] font-body rounded-xl focus:border-[#C9A864]/50 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.2em] text-[#C9A864] font-body">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0f0c] border border-[#F0EAD8]/10 px-5 py-4 text-sm text-[#F0EAD8] font-body rounded-xl focus:border-[#C9A864]/50 outline-none transition-colors"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-body text-xs bg-[#011863]/10 border border-[#5C1A1A]/30 rounded-xl px-4 py-3"
                  style={{ color: '#e08a8a' }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-[#0a0f0c] font-heading text-sm uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
              >
                {submitting ? 'Authenticating...' : 'Access Panel'}
              </motion.button>
            </form>

            <p className="text-center font-body text-[10px] uppercase tracking-wider" style={{ color: 'rgba(240,234,216,0.2)' }}>
              Authorized personnel only
            </p>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
