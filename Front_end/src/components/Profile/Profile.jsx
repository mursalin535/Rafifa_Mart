import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Get_orders_by_customer, Get_order_by_id } from '../Server/order';
import { Get_addresses, Add_address, Delete_address } from '../Server/address';
import { Update_customer_phone } from '../Server/customer';
import { MapPin, Phone, Plus, Trash2, X, Check } from 'lucide-react';

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
        <motion.line x1="30" y1="0" x2="30" y2="170" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut' }} />
        <motion.path d="M30 170 C 10 175, 8 190, 20 198 C 32 206, 32 190, 30 185" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.3 }} />
        <motion.path d="M30 170 C 50 175, 52 190, 40 198 C 28 206, 28 190, 30 185" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.5 }} />
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

const STATUS_STYLES = {
  pending:   { color: '#C9A864', bg: 'rgba(201,168,100,0.1)', label: 'Pending' },
  confirmed: { color: '#5FB3B0', bg: 'rgba(95,179,176,0.1)',  label: 'Confirmed' },
  shipped:   { color: '#6E9BC9', bg: 'rgba(110,155,201,0.1)', label: 'Shipped' },
  delivered: { color: '#1C4D3A', bg: 'rgba(28,77,58,0.15)',   label: 'Delivered' },
  rejected:  { color: '#5C1A1A', bg: 'rgba(92,26,26,0.15)',   label: 'Rejected' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-body"
      style={{ color: style.color, backgroundColor: style.bg, border: `1px solid ${style.color}40` }}
    >
      {style.label}
    </span>
  );
}

const EMPTY_ADDR = { label: 'Home', recipient_name: '', phone: '', address_line1: '', address_line2: '', city: '', district: '', division: '', postal_code: '' };

export default function Profile() {
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_ADDR);
  const [savingAddress, setSavingAddress] = useState(false);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) { setOrdersLoading(false); return; }
      try {
        const res = await Get_orders_by_customer(user.id);
        setOrders(Array.isArray(res) ? res : res?.data ?? []);
      } catch (err) { console.error('Failed to fetch orders:', err); }
      finally { setOrdersLoading(false); }
    }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    async function fetchAddresses() {
      if (!user) { setAddressesLoading(false); return; }
      try {
        const res = await Get_addresses(user.id);
        setAddresses(Array.isArray(res) ? res : res?.data ?? []);
      } catch (err) { console.error('Failed to fetch addresses:', err); }
      finally { setAddressesLoading(false); }
    }
    fetchAddresses();
  }, [user]);

  async function handleExpandOrder(orderId) {
    if (expandedOrderId === orderId) { setExpandedOrderId(null); return; }
    setExpandedOrderId(orderId);
    if (orderDetails[orderId]) return;
    setDetailsLoadingId(orderId);
    try {
      const res = await Get_order_by_id(orderId);
      setOrderDetails(prev => ({ ...prev, [orderId]: res?.data ?? res }));
    } catch (err) { console.error('Failed to fetch order details:', err); }
    finally { setDetailsLoadingId(null); }
  }

  function handleAddressField(key, val) {
    setNewAddress(prev => ({ ...prev, [key]: val }));
  }

  async function handleSaveAddress() {
    if (!newAddress.recipient_name || !newAddress.phone || !newAddress.address_line1 || !newAddress.city) return;
    setSavingAddress(true);
    try {
      const res = await Add_address({ ...newAddress, customer_id: user.id });
      const saved = res?.data ?? res;
      setAddresses(prev => [...prev, saved]);
      setNewAddress(EMPTY_ADDR);
      setShowAddressForm(false);
    } catch (err) { console.error('Failed to save address:', err); }
    finally { setSavingAddress(false); }
  }

  async function handleDeleteAddress(addrId) {
    try {
      await Delete_address(addrId);
      setAddresses(prev => prev.filter(a => a.id !== addrId));
    } catch (err) { console.error('Failed to delete address:', err); }
  }

  async function handleSavePhone() {
    setSavingPhone(true);
    try {
      await Update_customer_phone(user.id, phoneValue);
      await refreshUser();
      setEditingPhone(false);
    } catch (err) { console.error('Failed to update phone:', err); }
    finally { setSavingPhone(false); }
  }

  if (authLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]"><span className="font-body text-[#F0EAD8]/40 text-sm">Loading your profile...</span></div>;
  }
  if (!user) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]"><span className="font-body text-[#F0EAD8]/50 text-sm">Please log in to view your profile.</span></div>;
  }

  return (
    <>
      <motion.div className="w-full h-[15vh] bg-[#0a0f0c]" />
      <motion.div className="w-full min-h-[95vh] bg-[#0a0f0c] flex flex-row justify-center items-stretch gap-0 relative overflow-hidden">

        <motion.div className="w-[8%] h-full flex justify-center items-center bg-[#011863]"><VerticalOrnament /></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[84%] my-6 rounded-[2rem] border-2 border-[#C9A864]/40 bg-[#0F1A15] overflow-hidden flex flex-col"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="w-full h-full overflow-y-auto custom-scrollbar bg-black/40 flex flex-col lg:flex-row">

            {/* ═══════════ LEFT — Profile + Addresses ═══════════ */}
            <div className="w-full lg:w-[55%] p-8 lg:p-10 flex flex-col gap-8 border-b lg:border-b-0 lg:border-r border-[#C9A864]/10">

              {/* Header */}
              <motion.div className='w-full flex justify-center items-center'>
                <span className="text-xs uppercase tracking-[0.3em] text-[#C9A864] font-body">My Profile</span>
              </motion.div>

              {/* Top row — Avatar + Name left, Info cards right */}
              <div className="flex items-center gap-6">
                {/* Avatar + Name */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-[110px] h-[110px] flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, #C9A864, transparent 30%, transparent 70%, #C9A864, #F0EAD8)', padding: '3px' }}>
                      <div className="w-full h-full rounded-full bg-[#0a0f0c]" />
                    </motion.div>
                    <div className="absolute inset-[6px] rounded-full overflow-hidden bg-[#0d1410] flex items-center justify-center">
                      {user.profile_pic ? (
                        <img src={user.profile_pic} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading text-[#C9A864] text-2xl">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                  </div>
                  <h1 className="font-heading text-2xl text-center leading-tight mt-3 bg-clip-text text-transparent bg-[length:200%_100%]"
                    style={{ backgroundImage: 'linear-gradient(90deg, #F0EAD8, #C9A864, #F0EAD8)', animation: 'shimmer 5s linear infinite' }}>
                    {user.name}
                  </h1>
                </div>

                {/* Info cards */}
                <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                  {/* Email */}
                  <div className="flex items-center gap-3 border border-[#C9A864]/10 bg-[#0d1410]/60 px-4 py-2.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-[#C9A864] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#F0EAD8]/40 font-body block">Email</span>
                      <span className="font-body text-[#F0EAD8] text-xs truncate block">{user.email}</span>
                    </div>
                  </div>

                  {/* Phone — editable */}
                  <div className="border border-[#C9A864]/10 bg-[#0d1410]/60 px-4 py-2.5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <Phone size={12} className="text-[#5FB3B0] shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#F0EAD8]/40 font-body block">Phone</span>
                          {editingPhone ? (
                            <input type="text" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)}
                              placeholder="Enter phone"
                              className="font-body text-[#F0EAD8] text-xs bg-transparent border-b border-[#C9A864]/40 outline-none w-full mt-0.5 placeholder:text-[#F0EAD8]/20" />
                          ) : (
                            <span className="font-body text-[#F0EAD8] text-xs block">{user.phone || 'Not set'}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {editingPhone ? (
                          <>
                            <button onClick={handleSavePhone} disabled={savingPhone} className="p-1 rounded hover:bg-[#C9A864]/10 transition-colors">
                              <Check size={12} className="text-[#5FB3B0]" />
                            </button>
                            <button onClick={() => { setEditingPhone(false); setPhoneValue(''); }} className="p-1 rounded hover:bg-[#011863]/20 transition-colors">
                              <X size={12} className="text-[#F0EAD8]/40" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => { setEditingPhone(true); setPhoneValue(user.phone || ''); }} className="p-1 rounded hover:bg-[#C9A864]/10 transition-colors">
                            <Phone size={12} className="text-[#F0EAD8]/30" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total Orders + Partner since */}
                  <div className="flex gap-2.5">
                    <div className="flex-1 flex items-center gap-2 border border-[#C9A864]/10 bg-[#0d1410]/60 px-3 py-2.5 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-[#D98FB0] shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#F0EAD8]/40 font-body block">Orders</span>
                        <span className="font-body text-[#F0EAD8] text-xs">{orders.length}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 border border-[#C9A864]/10 bg-[#0d1410]/60 px-3 py-2.5 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-[#1C4D3A] shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#F0EAD8]/40 font-body block">Partner since</span>
                        <span className="font-body text-[#F0EAD8] text-xs">{new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════ Animated Divider ═══════════ */}
              <div className="w-full flex items-center justify-center py-1">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-px origin-left"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,100,0.4), transparent)' }}
                />
              </div>

              {/* ═══════════ ADDRESSES ═══════════ */}
              <div className="w-full mt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#C9A864]" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A864] font-body">Addresses</span>
                  </div>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C9A864]/60 hover:text-[#C9A864] transition-colors">
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>

                {addressesLoading ? (
                  <span className="font-body text-[#F0EAD8]/30 text-xs">Loading addresses...</span>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Address list */}
                    {addresses.map((addr) => (
                      <div key={addr.id} className="group flex items-start justify-between gap-2 px-3 py-2.5 border border-[#C9A864]/8 bg-[#0d1410]/40 rounded-lg">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-[#F0EAD8]/80 text-xs">{addr.label || 'Address'}</span>
                            {addr.is_default === 1 && (
                              <span className="text-[8px] uppercase tracking-wider text-[#C9A864]/50 border border-[#C9A864]/15 px-1 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <span className="font-body text-[#F0EAD8]/35 text-[11px] leading-relaxed block mt-0.5">
                            {addr.recipient_name && `${addr.recipient_name}, `}{addr.address_line1}{addr.city ? `, ${addr.city}` : ''}{addr.district ? `, ${addr.district}` : ''}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-1 rounded hover:bg-[#011863]/20 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5">
                          <Trash2 size={12} className="text-[#F0EAD8]/30 hover:text-red-400" />
                        </button>
                      </div>
                    ))}

                    {/* New address form */}
                    <AnimatePresence>
                      {showAddressForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2 p-3 border border-[#C9A864]/15 bg-[#0d1410]/60 rounded-lg">
                            <div className="flex gap-1.5">
                              {['Home', 'Work', 'Other'].map((lbl) => (
                                <button key={lbl} onClick={() => handleAddressField('label', lbl)}
                                  className={`flex-1 py-1.5 rounded text-[9px] uppercase tracking-wider font-body border transition-all ${newAddress.label === lbl ? 'border-[#C9A864]/50 bg-[#C9A864]/10 text-[#C9A864]' : 'border-[#F0EAD8]/10 text-[#F0EAD8]/30'}`}>
                                  {lbl}
                                </button>
                              ))}
                            </div>
                            {[
                              { key: 'recipient_name', placeholder: 'Name' },
                              { key: 'phone', placeholder: 'Phone' },
                              { key: 'address_line1', placeholder: 'Address' },
                              { key: 'city', placeholder: 'City' },
                              { key: 'district', placeholder: 'District' },
                            ].map(({ key, placeholder }) => (
                              <input key={key} type="text" value={newAddress[key]} onChange={(e) => handleAddressField(key, e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-[#0a0f0c]/50 border border-[#F0EAD8]/10 px-2.5 py-2 text-xs text-[#F0EAD8] font-body rounded placeholder:text-[#F0EAD8]/15 focus:outline-none focus:border-[#C9A864]/30" />
                            ))}
                            <div className="flex gap-1.5 mt-1">
                              <button onClick={() => { setShowAddressForm(false); setNewAddress(EMPTY_ADDR); }}
                                className="flex-1 py-2 rounded border border-[#F0EAD8]/10 text-[#F0EAD8]/40 text-[10px] uppercase tracking-wider font-body hover:border-[#F0EAD8]/20 transition-colors">
                                Cancel
                              </button>
                              <button onClick={handleSaveAddress} disabled={savingAddress || !newAddress.recipient_name || !newAddress.phone || !newAddress.address_line1 || !newAddress.city}
                                className="flex-1 py-2 rounded text-[10px] uppercase tracking-wider font-body text-[#0a0f0c] disabled:opacity-30 transition-colors"
                                style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}>
                                {savingAddress ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!showAddressForm && addresses.length === 0 && (
                      <span className="font-body text-[#F0EAD8]/20 text-[11px]">No addresses saved yet.</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ═══════════ RIGHT — Order History ═══════════ */}
            <div className="w-full lg:w-[45%] p-8 lg:p-10 flex flex-col justify-start gap-4">

              {/* Heading */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-base uppercase tracking-[0.3em] text-[#C9A864] font-body">Order History</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-40 h-px origin-center"
                  style={{ background: 'linear-gradient(90deg, transparent, #C9A864, transparent)' }}
                />
                <svg width="140" height="24" viewBox="0 0 140 24" className="opacity-60">
                  <g fill="none" stroke="#C9A864" strokeWidth="0.8">
                    <motion.line
                      x1="0" y1="12" x2="35" y2="12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M38 12 C42 5, 48 5, 52 12 C48 19, 42 19, 38 12Z"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut', delay: 0.3 }}
                    />
                    <motion.circle
                      cx="70" cy="12" r="3.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut', delay: 0.6 }}
                    />
                    <motion.circle
                      cx="70" cy="12" r="1.2"
                      fill="#C9A864" stroke="none"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut', delay: 0.9 }}
                    />
                    <motion.path
                      d="M88 12 C92 5, 98 5, 102 12 C98 19, 92 19, 88 12Z"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut', delay: 1.2 }}
                    />
                    <motion.line
                      x1="105" y1="12" x2="140" y2="12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut', delay: 1.5 }}
                    />
                  </g>
                </svg>
              </div>

              {ordersLoading ? (
                <div className="flex items-center gap-2 py-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-[#C9A864]/20 border-t-[#C9A864] rounded-full" />
                  <span className="font-body text-[#F0EAD8]/40 text-xs">Loading your orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-10">
                  <span className="font-body text-[#F0EAD8]/30 text-sm">You haven't placed any orders yet.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                  {orders.map((order, i) => {
                    const expanded = expandedOrderId === order.id;
                    const details = orderDetails[order.id];
                    const isLoadingDetails = detailsLoadingId === order.id;

                    return (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="border border-[#C9A864]/15 bg-[#0d1410]/60 rounded-xl overflow-hidden">
                        <button onClick={() => handleExpandOrder(order.id)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                          <div>
                            <span className="font-heading text-[#F0EAD8] text-sm block">Order #{order.id}</span>
                            <span className="font-body text-[#F0EAD8]/40 text-xs block mt-1">
                              {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-heading text-[#C9A864] text-sm">৳{order.total_amount}</span>
                            <StatusBadge status={order.status} />
                          </div>
                        </button>

                        {expanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}
                            className="px-5 pb-4 border-t border-[#C9A864]/10 overflow-hidden">
                            {isLoadingDetails ? (
                              <div className="flex items-center gap-2 mt-3">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3 h-3 border-2 border-[#C9A864]/20 border-t-[#C9A864] rounded-full" />
                                <span className="font-body text-[#F0EAD8]/30 text-xs">Loading details...</span>
                              </div>
                            ) : details?.items || details?.bottles ? (
                              <div className="flex flex-col gap-2 mt-3">
                                {details.items?.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between gap-4">
                                    <span className="font-body text-[#F0EAD8]/60 text-xs">
                                      {item.item_name}{item.volume_ml ? ` — ${item.volume_ml}ml` : ''} × {item.quantity}
                                    </span>
                                    <span className="font-body text-[#F0EAD8]/80 text-xs">৳{item.unit_price * item.quantity}</span>
                                  </div>
                                ))}
                                {details.bottles?.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between gap-4">
                                    <span className="font-body text-[#F0EAD8]/60 text-xs">
                                      {item.item_name}{item.volume ? ` — ${item.volume}` : ''} × {item.quantity}
                                    </span>
                                    <span className="font-body text-[#F0EAD8]/80 text-xs">৳{item.unit_price * item.quantity}</span>
                                  </div>
                                ))}
                                {details.address_line1 && (
                                  <div className="mt-3 pt-3 border-t border-[#F0EAD8]/5">
                                    <span className="text-[10px] uppercase tracking-wider text-[#F0EAD8]/30 font-body block mb-1">Delivered To</span>
                                    <span className="font-body text-[#F0EAD8]/50 text-xs">
                                      {details.recipient_name}, {details.address_line1}{details.address_line2 ? `, ${details.address_line2}` : ''}, {details.city}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="font-body text-[#F0EAD8]/30 text-xs mt-3 block">No item details found.</span>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </motion.div>

        <motion.div className="w-[8%] h-full flex justify-center items-center bg-[#011863]"><VerticalOrnament flip /></motion.div>
      </motion.div>

      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(201, 168, 100, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(201, 168, 100, 0.5); }
      `}</style>
    </>
  );
}
