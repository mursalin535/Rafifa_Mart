import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function VerticalOrnament({ flip = false }) {
  return (
    <motion.svg
      width="60"
      height="480"
      viewBox="0 0 60 480"
      className="opacity-80"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <g fill="none" stroke="#C9A864" strokeWidth="1.2">
        <motion.line
          x1="30" y1="0" x2="30" y2="170"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M30 170 C 10 175, 8 190, 20 198 C 32 206, 32 190, 30 185"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.path
          d="M30 170 C 50 175, 52 190, 40 198 C 28 206, 28 190, 30 185"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.circle
          cx="30" cy="240" r="6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', repeatDelay: 2.5, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.circle
          cx="30" cy="240" r="2"
          fill="#C9A864" stroke="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'loop', repeatDelay: 3.3, ease: 'easeInOut', delay: 1.1 }}
        />
        {[0, 90, 180, 270].map((deg, i) => (
          <motion.line
            key={deg}
            x1="30" y1="228" x2="30" y2="216"
            transform={`rotate(${deg} 30 240)`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: 'loop', repeatDelay: 3, ease: 'easeInOut', delay: 1 + i * 0.1 }}
          />
        ))}
        <motion.path
          d="M30 310 C 10 305, 8 290, 20 282 C 32 274, 32 290, 30 295"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.4 }}
        />
        <motion.path
          d="M30 310 C 50 305, 52 290, 40 282 C 28 274, 28 290, 30 295"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.6 }}
        />
        <motion.line
          x1="30" y1="310" x2="30" y2="480"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut', delay: 1.9 }}
        />
      </g>
    </motion.svg>
  );
}

function GoogleButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-3 border border-[#F0EAD8]/15 bg-[#0a0f0c] text-[#F0EAD8] font-body text-sm py-4 rounded-xl hover:border-[#C9A864]/40 transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
        <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
      </svg>
      Continue with Google
    </motion.button>
  );
}

function FormField({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-[11px] uppercase tracking-[0.2em] text-[#C9A864] font-body">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-[#F0EAD8]/25 font-body normal-case">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "w-full bg-[#0a0f0c] border border-[#F0EAD8]/10 px-5 py-4 text-sm text-[#F0EAD8] font-body rounded-xl focus:border-[#C9A864]/50 outline-none transition-colors";

  return (
    <>
      <motion.div className="w-full h-[12vh] bg-[#0a0f0c]" />

      <motion.div className="w-full min-h-[95vh] flex flex-row justify-center items-stretch relative overflow-hidden">

        {/* বাম প্যানেল */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#011863] left-0 flex justify-start items-center pr-4 lg:pr-10">
          <VerticalOrnament />
        </motion.div>

        {/* ডান প্যানেল */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#13201A] right-0 flex justify-end items-center pl-4 lg:pl-10">
          <VerticalOrnament flip />
        </motion.div>

        {/* কেন্দ্রের কার্ড */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[92%] sm:w-[80%] lg:w-[55%] xl:w-[42%] my-6 z-10 bg-[#0a0f0c] rounded-[2rem] border-2 border-[#C9A864]/40 overflow-hidden flex flex-col"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="w-full overflow-y-auto custom-scrollbar px-8 sm:px-12 py-12 flex flex-col gap-10">

            {/* হেডার */}
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 0.8 }}
                className="text-xs uppercase text-[#C9A864] font-body mb-4 block"
              >
                Rafifa Mart
              </motion.span>
              <h1
                className="font-heading text-4xl mb-4 bg-clip-text text-transparent bg-[length:200%_100%]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #F0EAD8 0%, #C9A864 25%, #F0EAD8 50%, #C9A864 75%, #F0EAD8 100%)',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                Welcome Back
              </h1>
              <motion.div className='w-full flex justify-center items-center'>
              <svg width="120" height="16" viewBox="0 0 120 16" className="opacity-60 mx-auto">
                <line x1="0" y1="8" x2="45" y2="8" stroke="#C9A864" strokeWidth="1" />
                <circle cx="60" cy="8" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
                <line x1="75" y1="8" x2="120" y2="8" stroke="#C9A864" strokeWidth="1" />
              </svg>
              </motion.div>
            </div>

            {/* Google */}
            <GoogleButton onClick={loginWithGoogle} />

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#F0EAD8]/10" />
              <span className="font-body text-[#F0EAD8]/30 text-xs uppercase tracking-wider">or continue with email</span>
              <div className="h-px flex-1 bg-[#F0EAD8]/10" />
            </div>

            {/* ফর্ম — প্রতিটা field-এর মাঝে যথেষ্ট gap */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FormField label="Email Address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </FormField>

              <FormField label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClasses}
                />
              </FormField>

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
                className="w-full text-[#0a0f0c] font-heading text-sm uppercase tracking-widest py-4 rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
              >
                {submitting ? 'Logging in...' : 'Log In'}
              </motion.button>
            </form>

            <p className="text-center font-body text-[#F0EAD8]/40 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" state={{ redirectTo }} className="text-[#C9A864] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>

      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(201, 168, 100, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(201, 168, 100, 0.5);
        }
      `}</style>
    </>
  );
}