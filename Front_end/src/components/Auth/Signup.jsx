import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5007';
const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 60;

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
        <motion.circle cx="30" cy="240" r="6" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', repeatDelay: 2.5, ease: 'easeInOut', delay: 0.8 }} />
        <motion.circle cx="30" cy="240" r="2" fill="#C9A864" stroke="none" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, repeat: Infinity, repeatType: 'loop', repeatDelay: 3.3, ease: 'easeInOut', delay: 1.1 }} />
        {[0, 90, 180, 270].map((deg, i) => (
          <motion.line key={deg} x1="30" y1="228" x2="30" y2="216" transform={`rotate(${deg} 30 240)`} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.7, repeat: Infinity, repeatType: 'loop', repeatDelay: 3, ease: 'easeInOut', delay: 1 + i * 0.1 }} />
        ))}
        <motion.path d="M30 310 C 10 305, 8 290, 20 282 C 32 274, 32 290, 30 295" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.4 }} />
        <motion.path d="M30 310 C 50 305, 52 290, 40 282 C 28 274, 28 290, 30 295" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.6 }} />
        <motion.line x1="30" y1="310" x2="30" y2="480" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut', delay: 1.9 }} />
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
        <label className="text-[11px] uppercase tracking-[0.2em] text-[#C9A864] font-body">{label}</label>
        {hint && <span className="text-[10px] text-[#F0EAD8]/25 font-body normal-case">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function OtpInput({ value, onChange, onSubmit, loading }) {
  const inputRefs = [];

  function handleChange(index, e) {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const digits = val.split('');
    const newValue = value.split('');

    if (digits.length === 1) {
      newValue[index] = digits[0];
      onChange(newValue.join(''));
      if (index < OTP_LENGTH - 1) {
        inputRefs[index + 1]?.focus();
      }
    } else if (digits.length === OTP_LENGTH) {
      onChange(val.slice(0, OTP_LENGTH));
      inputRefs[OTP_LENGTH - 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted) {
      onChange(pasted.padEnd(OTP_LENGTH, ''));
      inputRefs[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="flex justify-center gap-3 mb-6">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={i === 0 ? OTP_LENGTH : 1}
            value={value[i] || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="w-12 h-14 text-center font-heading text-xl outline-none transition-all duration-200 rounded-lg"
            style={{
              backgroundColor: '#0a0f0c',
              border: `1.5px solid ${value[i] ? 'rgba(201,168,100,0.5)' : 'rgba(240,234,216,0.1)'}`,
              color: '#F0EAD8',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(201,168,100,0.6)'}
            onBlur={(e) => e.target.style.borderColor = value[i] ? 'rgba(201,168,100,0.5)' : 'rgba(240,234,216,0.1)'}
          />
        ))}
      </div>

      {loading ? (
        <div className="w-full text-center py-4 font-heading text-sm uppercase tracking-widest text-[#C9A864]/60">
          Verifying...
        </div>
      ) : (
        <motion.button
          type="submit"
          disabled={value.length < OTP_LENGTH}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full text-[#0a0f0c] font-heading text-sm uppercase tracking-widest py-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
        >
          Verify & Create Account
        </motion.button>
      )}
    </form>
  );
}

export default function Signup() {
  const { loginWithGoogle, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/';

  // Step 1 fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2 OTP
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendAvailable, setResendAvailable] = useState(false);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendAvailable(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  // Step 1: Send OTP
  async function handleSendOtp() {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const passwordValid = passwordChecks.every((c) => c.test(password));
    if (!passwordValid) {
      setError('Password must include an uppercase letter, lowercase letter, digit, and special character.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');

      setStep(2);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setResendAvailable(false);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp() {
    setOtpLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Refresh auth context so user state is updated
      await refreshUser();
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setOtp('');
    } finally {
      setOtpLoading(false);
    }
  }

  // Resend OTP
  async function handleResend() {
    setResendAvailable(false);
    setTimeLeft(OTP_EXPIRY_SECONDS);
    setOtp('');
    setError('');
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend code');
    } catch (err) {
      setError(err.message || 'Failed to resend');
    }
  }

  const inputClasses =
    "w-full bg-[#0a0f0c] border border-[#F0EAD8]/10 px-5 py-4 text-sm text-[#F0EAD8] font-body rounded-xl focus:border-[#C9A864]/50 outline-none transition-colors";

  const passwordChecks = [
    { key: 'minLength', label: 'At least 6 characters', test: (v) => v.length >= 6 },
    { key: 'hasUppercase', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
    { key: 'hasLowercase', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
    { key: 'hasDigit', label: 'One digit', test: (v) => /[0-9]/.test(v) },
    { key: 'hasSpecial', label: 'One special character (!@#$...)', test: (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v) },
  ];

  return (
    <>
      <motion.div className="w-full h-[12vh] bg-[#0a0f0c]" />

      <motion.div className="w-full min-h-[95vh] flex flex-row justify-center items-stretch relative overflow-hidden">
        {/* Left panel */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#3A1428] left-0 flex justify-start items-center pr-4 lg:pr-10">
          <VerticalOrnament />
        </motion.div>

        {/* Right panel */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#13201A] right-0 flex justify-end items-center pl-4 lg:pl-10">
          <VerticalOrnament flip />
        </motion.div>

        {/* Center card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[92%] sm:w-[80%] lg:w-[55%] xl:w-[42%] my-6 z-10 bg-[#0a0f0c] rounded-[2rem] border-2 border-[#C9A864]/40 overflow-hidden flex flex-col"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="w-full overflow-y-auto custom-scrollbar px-8 sm:px-12 py-12 flex flex-col gap-8">

            {/* Header */}
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
                  backgroundImage: 'linear-gradient(90deg, #C9A864 0%, #F0EAD8 25%, #C9A864 50%, #F0EAD8 75%, #C9A864 100%)',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                {step === 1 ? 'Join Us' : 'Verify Email'}
              </h1>
              <motion.div className='w-full flex justify-center items-center'>
                <svg width="120" height="16" viewBox="0 0 120 16" className="opacity-60 mx-auto">
                  <line x1="0" y1="8" x2="45" y2="8" stroke="#C9A864" strokeWidth="1" />
                  <circle cx="60" cy="8" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
                  <line x1="75" y1="8" x2="120" y2="8" stroke="#C9A864" strokeWidth="1" />
                </svg>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Google */}
                  <GoogleButton onClick={loginWithGoogle} />

                  <div className="flex items-center gap-4 my-6">
                    <div className="h-px flex-1 bg-[#F0EAD8]/10" />
                    <span className="font-body text-[#F0EAD8]/30 text-xs uppercase tracking-wider">or continue with email</span>
                    <div className="h-px flex-1 bg-[#F0EAD8]/10" />
                  </div>

                  {/* Form */}
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Full Name" hint="required">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClasses} />
                      </FormField>
                      <FormField label="Phone" hint="optional">
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" className={inputClasses} />
                      </FormField>
                    </div>

                    <FormField label="Email Address">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClasses} />
                    </FormField>

                    <FormField label="Password">
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className={inputClasses} />
                    </FormField>

                    {/* Password requirements */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col gap-1.5 px-1"
                      >
                        {passwordChecks.map((check) => {
                          const passed = check.test(password);
                          return (
                            <div key={check.key} className="flex items-center gap-2">
                              <div
                                className="w-3.5 h-3.5 flex items-center justify-center text-[8px] rounded-full transition-all duration-300"
                                style={{
                                  backgroundColor: passed ? 'rgba(92,138,110,0.2)' : 'rgba(240,234,216,0.06)',
                                  border: `1px solid ${passed ? '#5C8A6E' : 'rgba(240,234,216,0.12)'}`,
                                  color: passed ? '#5C8A6E' : 'rgba(240,234,216,0.2)',
                                }}
                              >
                                {passed ? '✓' : ''}
                              </div>
                              <span
                                className="font-body text-[10px] transition-colors duration-300"
                                style={{ color: passed ? '#5C8A6E' : 'rgba(240,234,216,0.3)' }}
                              >
                                {check.label}
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}

                    {error && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-body text-xs bg-[#011863]/10 border border-[#5C1A1A]/30 rounded-xl px-4 py-3" style={{ color: '#e08a8a' }}>
                        {error}
                      </motion.p>
                    )}

                    <motion.button
                      onClick={handleSendOtp}
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-[#0a0f0c] font-heading text-sm uppercase tracking-widest py-4 rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
                    >
                      {submitting ? 'Sending Code...' : 'Send Verification Code'}
                    </motion.button>
                  </div>

                  <p className="text-center font-body text-[#F0EAD8]/40 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" state={{ redirectTo }} className="text-[#C9A864] hover:underline">Log in</Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* OTP info */}
                  <div className="text-center mb-6">
                    <p className="font-body text-sm" style={{ color: 'rgba(240,234,216,0.55)' }}>
                      We sent a 6-digit code to
                    </p>
                    <p className="font-heading text-sm mt-1" style={{ color: '#C9A864' }}>
                      {email}
                    </p>
                  </div>

                  {/* OTP Input */}
                  <OtpInput value={otp} onChange={setOtp} onSubmit={handleVerifyOtp} loading={otpLoading} />

                  {/* Timer / Resend */}
                  <div className="text-center mt-5">
                    {!resendAvailable ? (
                      <p className="font-body text-xs" style={{ color: 'rgba(240,234,216,0.35)' }}>
                        Code expires in{' '}
                        <span style={{ color: timeLeft <= 15 ? '#e08a8a' : '#C9A864' }}>
                          {formatTime(timeLeft)}
                        </span>
                      </p>
                    ) : (
                      <button onClick={handleResend} className="font-body text-xs underline" style={{ color: '#C9A864' }}>
                        Resend Code
                      </button>
                    )}
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-body text-xs bg-[#011863]/10 border border-[#5C1A1A]/30 rounded-xl px-4 py-3 mt-4" style={{ color: '#e08a8a' }}>
                      {error}
                    </motion.p>
                  )}

                  <button
                    onClick={() => { setStep(1); setOtp(''); setError(''); setResendAvailable(false); setTimeLeft(OTP_EXPIRY_SECONDS); }}
                    className="w-full text-center font-body text-xs mt-6"
                    style={{ color: 'rgba(240,234,216,0.4)' }}
                  >
                    ← Back to signup
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(201, 168, 100, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(201, 168, 100, 0.5); }
      `}</style>
    </>
  );
}
