import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Get_customers } from '../Server/customer';
import { Search, Users, DollarSign, UserCheck, UserX, ShieldCheck, ShieldOff, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export default function AdminCustomer() {
  const { dark } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await Get_customers();
      if (res.success) setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.account_status === 'active').length,
    totalRevenue: customers.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0),
    avgSpend: customers.length > 0
      ? customers.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0) / customers.filter(c => Number(c.total_spent) > 0).length || 0
      : 0,
  };

  const cardBg = dark ? '#0D1410' : '#F5F1E6';
  const borderColor = dark ? '#1C4D3A' : '#C9B99A';
  const mutedColor = dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)';
  const textColor = dark ? '#F0EAD8' : '#1A2620';

  return (
    <div className="w-full px-4 md:px-8 py-8" style={{ color: textColor }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10"
      >
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Users size={20} strokeWidth={1.5} style={{ color: '#C9A864' }} />
          </motion.div>
          <h1 className="font-heading text-2xl sm:text-3xl tracking-[0.12em] uppercase" style={{ color: '#C9A864' }}>
            Customers
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs mt-1.5 ml-8"
          style={{ color: mutedColor }}
        >
          {customers.length} registered customer{customers.length !== 1 ? 's' : ''}
        </motion.p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-10">
        {[
          { label: 'Total Customers', value: stats.total, icon: Users, color: '#C9A864' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: '#4CAF7D' },
          { label: 'Total Revenue', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#C9A864' },
          { label: 'Avg. Spend', value: `৳${Math.round(stats.avgSpend).toLocaleString()}`, icon: ShoppingBag, color: '#C9A864' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="flex items-center gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-5 lg:px-7 py-4 sm:py-5 lg:py-6"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}22`;
                e.currentTarget.style.borderColor = `${s.color}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = borderColor;
              }}
            >
              <motion.div
                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${s.color}14`, color: s.color }}
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Icon size={16} strokeWidth={1.5} />
              </motion.div>
              <div>
                <p className="font-heading text-base sm:text-lg lg:text-xl leading-none" style={{ color: textColor }}>
                  {s.value}
                </p>
                <p className="font-body text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider mt-1.5 sm:mt-2" style={{ color: mutedColor }}>
                  {s.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-8 sm:mb-10"
      >
        <div className="relative max-w-md">
       
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 font-body text-sm outline-none transition-all duration-300 rounded-3xl"
            style={{
              backgroundColor: dark ? '#0D1410' : '#F5F1E6',
              border: `1px solid ${borderColor}`,
              color: textColor,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#C9A864';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,100,0.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </motion.div>

      {/* Customer Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="font-body text-sm"
            style={{ color: mutedColor }}
          >
            Loading customers...
          </motion.p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center py-24"
        >
          <p className="font-body text-sm" style={{ color: mutedColor }}>No customers found</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-7">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const isSelected = selected?.id === c.id;
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelected(isSelected ? null : c)}
                  className="group relative cursor-pointer rounded-md p-[2px] overflow-hidden"
                >
                  {/* Simple animated border — rotates always, brightens on hover, brightest when selected */}
                  <motion.div
                    aria-hidden
                    className={`pointer-events-none absolute -inset-[45%] transition-opacity duration-300 ${
                      isSelected ? '' : 'opacity-35 group-hover:opacity-75'
                    }`}
                    style={{
                      background: isSelected
                        ? 'conic-gradient(from 0deg, #C9A864, #E0C284, #C9A864, #E0C284, #C9A864)'
                        : 'conic-gradient(from 0deg, #C9A864, #1C4D3A 50%, #C9A864 100%)',
                      ...(isSelected ? { opacity: 0.9 } : {}),
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Card body — inset so only a crisp 2px ring of the animated border shows */}
                  <div
                    className="relative rounded-[5px]"
                    style={{
                      backgroundColor: cardBg,
                      boxShadow: isSelected
                        ? '0 10px 30px rgba(201,168,100,0.18)'
                        : '0 0 0 rgba(0,0,0,0)',
                      transition: 'box-shadow 0.35s ease',
                    }}
                  >
                    {/* Card Header */}
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 lg:pt-8 pb-4 sm:pb-5 lg:pb-6">
                      {c.profile_pic ? (
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.25 }}
                          src={c.profile_pic}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover shrink-0"
                          style={{ border: `2px solid ${borderColor}` }}
                        />
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.08, rotate: 4 }}
                          transition={{ duration: 0.25 }}
                          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shrink-0 font-heading text-sm sm:text-base lg:text-lg"
                          style={{ backgroundColor: `${dark ? '#1C4D3A' : '#C9B99A'}30`, color: '#C9A864' }}
                        >
                          {c.name?.[0]?.toUpperCase() || '?'}
                        </motion.div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-base tracking-wide truncate">{c.name}</h3>
                        <p className="font-body text-sm truncate mt-1.5" style={{ color: mutedColor }}>
                          {c.email}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1.5 font-body text-[11px] uppercase tracking-wider shrink-0"
                        style={{
                          backgroundColor: c.account_status === 'active' ? 'rgba(76,175,125,0.12)' : 'rgba(181,80,79,0.12)',
                          color: c.account_status === 'active' ? '#4CAF7D' : '#B5504F',
                        }}
                      >
                        {c.account_status}
                      </span>
                    </div>

                    {/* Card Body — Info Grid */}
                    <div className="px-5 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-7 space-y-3 sm:space-y-4 lg:space-y-5">
                      {c.phone && (
                        <div className="flex items-center gap-3.5">
                          <Phone size={14} style={{ color: '#C9A864' }} />
                          <span className="font-body text-sm" style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}>
                            {c.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3.5">
                        <Calendar size={14} style={{ color: '#C9A864' }} />
                        <span className="font-body text-sm" style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}>
                          Joined {new Date(c.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3.5">
                        {c.google_id ? (
                          <ShieldCheck size={14} style={{ color: '#4CAF7D' }} />
                        ) : (
                          <ShieldOff size={14} style={{ color: mutedColor }} />
                        )}
                        <span className="font-body text-sm" style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}>
                          {c.google_id ? 'Google Account' : 'Email / Password'}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer — Spending */}
                    <div
                      className="flex items-center justify-between px-5 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6"
                      style={{ borderTop: `1px solid ${dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)'}` }}
                    >
                      <div>
                        <p className="font-body text-[11px] uppercase tracking-wider" style={{ color: mutedColor }}>
                          Total Spent
                        </p>
                        <p className="font-heading text-xl mt-1.5" style={{ color: '#C9A864' }}>
                          ৳{Number(c.total_spent || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body text-[11px] uppercase tracking-wider" style={{ color: mutedColor }}>
                          Orders
                        </p>
                        <p className="font-heading text-xl mt-1.5" style={{ color: textColor }}>
                          {c.order_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}