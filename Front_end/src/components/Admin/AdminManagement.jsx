import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Plus, Trash2, KeyRound, X, Loader2, Repeat, Mail, Lock, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://localhost:5007';
const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 60;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

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
      if (index < OTP_LENGTH - 1) inputRefs[index + 1]?.focus();
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
          <motion.input
            key={i}
            ref={(el) => (inputRefs[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={i === 0 ? OTP_LENGTH : 1}
            value={value[i] || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="w-11 h-12 text-center font-heading text-lg outline-none transition-all duration-200 rounded-lg"
            style={{
              backgroundColor: '#0a0f0c',
              border: `1.5px solid ${value[i] ? 'rgba(201,168,100,0.5)' : 'rgba(240,234,216,0.1)'}`,
              color: '#F0EAD8',
              boxShadow: value[i] ? '0 0 12px rgba(201,168,100,0.15)' : 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(201,168,100,0.6)';
              e.target.style.boxShadow = '0 0 16px rgba(201,168,100,0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = value[i] ? 'rgba(201,168,100,0.5)' : 'rgba(240,234,216,0.1)';
              e.target.style.boxShadow = value[i] ? '0 0 12px rgba(201,168,100,0.15)' : 'none';
            }}
          />
        ))}
      </div>
      <motion.div className='h-full w-full flex justify-start'>
        <motion.button
          type="submit"
          disabled={value.length < OTP_LENGTH || loading}
          whileHover={{ scale: 1.01, boxShadow: '0 4px 24px rgba(201,168,100,0.35)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full text-[#0a0f0c] font-heading text-[11px] uppercase tracking-[0.15em] py-3.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-shadow duration-300"
          style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
        >
          {loading ? 'Verifying...' : 'Verify & Add'}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default function AdminManagement() {
  const { dark } = useTheme();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendAvailable, setResendAvailable] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const inputStyle = {
    backgroundColor: dark ? '#0D1410' : '#F5F1E6',
    border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
    color: dark ? '#F0EAD8' : '#1A2620',
  };

  const borderColor = dark ? '#1C4D3A' : '#C9B99A';
  const cardBg = dark ? '#0D1410' : '#F5F1E6';
  const mutedColor = dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)';
  const textColor = dark ? '#F0EAD8' : '#1A2620';

  useEffect(() => {
    fetchAdmins();
    fetch(`${API_BASE}/admin/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setCurrentAdmin(data.admin))
      .catch(() => {});
  }, []);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setAddEmail('');
    setAddPassword('');
    setOtp('');
    setOtpStep(1);
    setError('');
    setTimeLeft(OTP_EXPIRY_SECONDS);
    setResendAvailable(false);
    setModal('add');
  }

  function openPassword(admin) {
    setSelectedAdmin(admin);
    setOldPassword('');
    setNewPassword('');
    setError('');
    setModal('password');
  }

  function openDelete(admin) {
    setSelectedAdmin(admin);
    setError('');
    setModal('delete');
  }

  function closeModal() {
    setModal(null);
    setSelectedAdmin(null);
    setError('');
  }

  useEffect(() => {
    if (modal !== 'add' || otpStep !== 2 || timeLeft <= 0) return;
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
  }, [modal, otpStep, timeLeft]);

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }, []);

  async function handleSendOtp() {
    setError('');
    if (!addEmail.trim() || !addPassword.trim()) {
      setError('Email and password are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: addEmail.trim(), password: addPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpStep(2);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setResendAvailable(false);
      setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleVerifyOtp() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: addEmail.trim(), otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      closeModal();
      fetchAdmins();
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally {
      setSaving(false);
    }
  }

  async function handleResend() {
    setResendAvailable(false);
    setTimeLeft(OTP_EXPIRY_SECONDS);
    setOtp('');
    setError('');
    try {
      await fetch(`${API_BASE}/admin/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: addEmail.trim(), password: addPassword }),
      });
    } catch (err) {
      setError('Failed to resend.');
    }
  }

  async function handleChangePassword() {
    setError('');
    if (!oldPassword || !newPassword) {
      setError('Both passwords are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/${selectedAdmin.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      closeModal();
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full px-4 md:px-8 py-6" style={{ color: textColor }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield size={20} strokeWidth={1.5} style={{ color: '#C9A864' }} />
          </motion.div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl tracking-[0.1em] uppercase" style={{ color: '#C9A864' }}>
              Admin
            </h1>
            <p className="font-body text-[10px] sm:text-xs mt-1" style={{ color: mutedColor }}>
              {admins.length} admin account{admins.length !== 1 ? 's' : ''} registered
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 4px 24px rgba(201,168,100,0.35)' }}
          whileTap={{ scale: 0.96 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-2.5 font-heading text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-4xl transition-shadow duration-300"
          style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Admin
        </motion.button>
      </motion.div>

      {/* Brass Hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full h-[1px] mb-8 origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,100,0.3), transparent)' }}
      />

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full overflow-hidden relative"
        style={{
          border: `1px solid ${dark ? 'rgba(28,77,58,0.4)' : 'rgba(201,185,154,0.4)'}`,
          boxShadow: '0 0 40px rgba(201,168,100,0.04)',
        }}
      >
        {/* Decorative corner glow */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, #C9A864, transparent 70%)' }}
        />

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
                  background: `linear-gradient(135deg, ${dark ? 'rgba(201,168,100,0.06)' : 'rgba(201,168,100,0.04)'}, transparent)`,
                }}
              >
                <th
                  className="px-4 sm:px-6 py-4 font-heading text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase"
                  style={{ color: '#C9A864', backgroundColor: 'transparent' }}
                >
                  Admin Email
                </th>
                <th
                  className="px-4 sm:px-6 py-4 font-heading text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase hidden sm:table-cell"
                  style={{ color: '#C9A864', backgroundColor: 'transparent' }}
                >
                  Created
                </th>
                <th
                  className="px-4 sm:px-6 py-4 font-heading text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-right"
                  style={{ color: '#C9A864', backgroundColor: 'transparent' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex flex-col items-center gap-3"
                    >
                      <Loader2 size={22} className="animate-spin" style={{ color: '#C9A864' }} />
                      <p className="font-body text-xs" style={{ color: mutedColor }}>Loading admins...</p>
                    </motion.div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(201,168,100,0.08)', color: '#C9A864' }}
                      >
                        <Shield size={28} strokeWidth={1.2} />
                      </motion.div>
                      <p className="font-body text-sm" style={{ color: mutedColor }}>No admins found</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                admins.map((a, index) => {
                  const isSelf = currentAdmin?.id === a.id;
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                      style={{
                        borderBottom: `1px solid ${dark ? 'rgba(28,77,58,0.25)' : 'rgba(201,185,154,0.25)'}`,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = dark ? 'rgba(28,77,58,0.08)' : 'rgba(201,185,154,0.08)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,100,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <motion.div
                            whileHover={{ scale: 1.12, rotate: 6 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 rounded-lg"
                            style={{
                              backgroundColor: isSelf ? 'rgba(201,168,100,0.18)' : 'rgba(201,168,100,0.1)',
                              color: '#C9A864',
                              boxShadow: isSelf ? '0 0 16px rgba(201,168,100,0.15)' : 'none',
                            }}
                          >
                            <Shield size={14} strokeWidth={1.5} />
                          </motion.div>
                          <div>
                            <span className="font-heading text-xs sm:text-sm tracking-wide block">{a.admin_email}</span>
                            {isSelf && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-block mt-1 px-2 py-0.5 font-heading text-[8px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.15em] rounded-full"
                                style={{
                                  backgroundColor: 'rgba(201,168,100,0.15)',
                                  color: '#C9A864',
                                  boxShadow: '0 0 8px rgba(201,168,100,0.2)',
                                }}
                              >
                                You
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <span className="font-body text-[10px] sm:text-xs" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                          {new Date(a.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <motion.button
                            title="Change password"
                            whileHover={{ scale: 1.1, boxShadow: '0 0 16px rgba(201,168,100,0.25)' }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                            style={{
                              color: '#C9A864',
                              backgroundColor: dark ? 'rgba(201,168,100,0.08)' : 'rgba(201,168,100,0.06)',
                            }}
                            onClick={() => openPassword(a)}
                          >
                            <KeyRound size={13} />
                          </motion.button>
                          {!isSelf && (
                            <motion.button
                              title="Delete admin"
                              whileHover={{ scale: 1.1, boxShadow: '0 0 16px rgba(181,80,79,0.25)' }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                              style={{
                                color: '#B5504F',
                                backgroundColor: 'rgba(181,80,79,0.08)',
                              }}
                              onClick={() => openDelete(a)}
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full overflow-hidden relative"
              style={{
                maxWidth: modal === 'delete' ? '420px' : '480px',
                backgroundColor: dark ? '#0A0A0A' : '#FAF7F0',
                border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,100,0.06)',
              }}
            >
              {/* Decorative corner glow on modal */}
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, #C9A864, transparent 70%)' }}
              />

              {/* Add Admin Modal */}
              {modal === 'add' && (
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'rgba(201,168,100,0.12)', color: '#C9A864' }}
                      >
                        <Shield size={18} strokeWidth={1.5} />
                      </motion.div>
                      <div>
                        <h2 className="font-heading text-lg tracking-[0.1em] uppercase" style={{ color: '#C9A864' }}>
                          {otpStep === 1 ? 'Add New Admin' : 'Verify Email'}
                        </h2>
                        <p className="font-body text-[10px] mt-0.5" style={{ color: mutedColor }}>
                          {otpStep === 1 ? 'Step 1 of 2 — Enter details' : 'Step 2 of 2 — Enter OTP'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeModal}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-6 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: otpStep >= 1 ? '#C9A864' : dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)',
                          boxShadow: otpStep === 1 ? '0 0 8px rgba(201,168,100,0.3)' : 'none',
                        }}
                      />
                      <div
                        className="w-6 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: otpStep >= 2 ? '#C9A864' : dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)',
                          boxShadow: otpStep === 2 ? '0 0 8px rgba(201,168,100,0.3)' : 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Brass Hairline */}
                  <div
                    className="w-full h-[1px] mb-5"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,100,0.2), transparent)' }}
                  />

                  {otpStep === 1 ? (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2.5">
                        <label className="font-heading text-[10px] tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                          <Mail size={11} style={{ color: '#C9A864' }} />
                          Email
                        </label>
                        <input
                          type="email"
                          value={addEmail}
                          onChange={(e) => setAddEmail(e.target.value)}
                          placeholder="admin@example.com"
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-lg transition-all duration-200"
                          style={inputStyle}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#C9A864';
                            e.target.style.boxShadow = '0 0 0 3px rgba(201,168,100,0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = dark ? '#1C4D3A' : '#C9B99A';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <label className="font-heading text-[10px] tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                          <Lock size={11} style={{ color: '#C9A864' }} />
                          Password
                        </label>
                        <input
                          type="password"
                          value={addPassword}
                          onChange={(e) => setAddPassword(e.target.value)}
                          placeholder="Min 6 chars, upper, lower, digit, special"
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-lg transition-all duration-200"
                          style={inputStyle}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#C9A864';
                            e.target.style.boxShadow = '0 0 0 3px rgba(201,168,100,0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = dark ? '#1C4D3A' : '#C9B99A';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-body text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                          style={{ color: '#e08a8a', backgroundColor: 'rgba(181,80,79,0.1)' }}
                        >
                          <AlertTriangle size={12} />
                          {error}
                        </motion.p>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(201,168,100,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendOtp}
                        disabled={saving}
                        className="w-full py-3 font-heading text-[11px] tracking-[0.15em] uppercase disabled:opacity-50 rounded-lg transition-shadow duration-300 mt-1"
                        style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
                      >
                        {saving ? 'Sending...' : 'Send Verification Code'}
                      </motion.button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-5">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="w-14 h-14 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: 'rgba(201,168,100,0.1)', color: '#C9A864' }}
                        >
                          <Lock size={22} strokeWidth={1.5} />
                        </motion.div>
                      </div>
                      <p className="font-body text-xs text-center mb-5" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                        Code sent to <span className="font-heading" style={{ color: '#C9A864' }}>{addEmail}</span>
                      </p>
                      <OtpInput value={otp} onChange={setOtp} onSubmit={handleVerifyOtp} loading={saving} />
                      <div className="text-center mt-4">
                        {!resendAvailable ? (
                          <p className="font-body text-[10px] flex items-center justify-center gap-1.5" style={{ color: dark ? 'rgba(237,231,218,0.3)' : 'rgba(26,38,32,0.3)' }}>
                            Expires in
                            <span
                              className="font-heading text-xs"
                              style={{ color: timeLeft <= 15 ? '#e08a8a' : '#C9A864' }}
                            >
                              {formatTime(timeLeft)}
                            </span>
                          </p>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleResend}
                            className="font-body text-[10px] underline flex items-center gap-1.5 mx-auto"
                            style={{ color: '#C9A864' }}
                          >
                            <Repeat size={10} />
                            Resend Code
                          </motion.button>
                        )}
                      </div>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-body text-xs px-4 py-2.5 rounded-lg mt-4 flex items-center gap-2"
                          style={{ color: '#e08a8a', backgroundColor: 'rgba(181,80,79,0.1)' }}
                        >
                          <AlertTriangle size={12} />
                          {error}
                        </motion.p>
                      )}
                      <motion.button
                        whileHover={{ x: -3 }}
                        onClick={() => { setOtpStep(1); setOtp(''); setError(''); }}
                        className="w-full text-center font-body text-[10px] mt-5 flex items-center justify-center gap-1.5"
                        style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}
                      >
                        <ArrowLeft size={10} />
                        Back to details
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Change Password Modal */}
              {modal === 'password' && (
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, -12, 12, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'rgba(201,168,100,0.12)', color: '#C9A864' }}
                      >
                        <KeyRound size={18} strokeWidth={1.5} />
                      </motion.div>
                      <div>
                        <h2 className="font-heading text-lg tracking-[0.1em] uppercase" style={{ color: '#C9A864' }}>
                          Change Password
                        </h2>
                        <p className="font-body text-[10px] mt-0.5" style={{ color: mutedColor }}>
                          Update credentials for this admin
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeModal}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  <p className="font-body text-xs mb-5 flex items-center gap-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                    <Shield size={11} style={{ color: '#C9A864' }} />
                    {selectedAdmin?.admin_email}
                  </p>

                  {/* Brass Hairline */}
                  <div
                    className="w-full h-[1px] mb-5"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,100,0.2), transparent)' }}
                  />

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2.5">
                      <label className="font-heading text-[10px] tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                        <Lock size={11} style={{ color: '#C9A864' }} />
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 font-body text-xs outline-none rounded-lg transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#C9A864';
                          e.target.style.boxShadow = '0 0 0 3px rgba(201,168,100,0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = dark ? '#1C4D3A' : '#C9B99A';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="font-heading text-[10px] tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                        <KeyRound size={11} style={{ color: '#C9A864' }} />
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 font-body text-xs outline-none rounded-lg transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#C9A864';
                          e.target.style.boxShadow = '0 0 0 3px rgba(201,168,100,0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = dark ? '#1C4D3A' : '#C9B99A';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-body text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                        style={{ color: '#e08a8a', backgroundColor: 'rgba(181,80,79,0.1)' }}
                      >
                        <AlertTriangle size={12} />
                        {error}
                      </motion.p>
                    )}
                    <div className="flex justify-end gap-3 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={closeModal}
                        className="px-5 py-2.5 font-heading text-[11px] tracking-[0.15em] uppercase rounded-lg transition-all duration-200"
                        style={{ border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`, color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(201,168,100,0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="px-6 py-2.5 font-heading text-[11px] tracking-[0.15em] uppercase disabled:opacity-50 rounded-lg transition-shadow duration-300"
                        style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
                      >
                        {saving ? 'Saving...' : 'Update'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Admin Modal */}
              {modal === 'delete' && (
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'rgba(181,80,79,0.12)', color: '#B5504F' }}
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </motion.div>
                      <h2 className="font-heading text-lg tracking-[0.1em] uppercase" style={{ color: '#B5504F' }}>
                        Delete Admin
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeModal}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  {/* Brass Hairline */}
                  <div
                    className="w-full h-[1px] mb-5"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(181,80,79,0.2), transparent)' }}
                  />

                  <p className="font-body text-sm mb-6" style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}>
                    Remove <strong className="font-heading" style={{ color: '#C9A864' }}>{selectedAdmin?.admin_email}</strong>? This action is permanent and cannot be undone.
                  </p>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-body text-xs px-4 py-2.5 rounded-lg mb-4 flex items-center gap-2"
                      style={{ color: '#e08a8a', backgroundColor: 'rgba(181,80,79,0.1)' }}
                    >
                      <AlertTriangle size={12} />
                      {error}
                    </motion.p>
                  )}
                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={closeModal}
                      className="px-5 py-2.5 font-heading text-[11px] tracking-[0.15em] uppercase rounded-lg transition-all duration-200"
                      style={{ border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`, color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(181,80,79,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDelete}
                      disabled={saving}
                      className="px-5 py-2.5 font-heading text-[11px] tracking-[0.15em] uppercase disabled:opacity-50 rounded-lg transition-shadow duration-300 flex items-center gap-2"
                      style={{ backgroundColor: '#5C1A1A', color: '#F0EAD8' }}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={12} />
                          Delete
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
