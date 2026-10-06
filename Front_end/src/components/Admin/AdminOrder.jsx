import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Get_orders, Get_order_by_id, Update_order_status, Delete_order } from '../Server/order';
import {
  Search, Package, Clock, CheckCircle2, Truck, CircleCheckBig, XCircle,
  ChevronDown, ChevronUp, Trash2, MapPin, CreditCard, ShoppingBag,
} from 'lucide-react';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'rejected'];

const STATUS_CONFIG = {
  pending:    { color: '#C9A864', bg: 'rgba(201,168,100,0.12)', icon: Clock, label: 'Pending' },
  confirmed:  { color: '#4CAF7D', bg: 'rgba(76,175,125,0.12)', icon: CheckCircle2, label: 'Confirmed' },
  shipped:    { color: '#5B9BD5', bg: 'rgba(91,155,213,0.12)', icon: Truck, label: 'Shipped' },
  delivered:  { color: '#4CAF7D', bg: 'rgba(76,175,125,0.12)', icon: CircleCheckBig, label: 'Delivered' },
  rejected:   { color: '#B5504F', bg: 'rgba(181,80,79,0.12)', icon: XCircle, label: 'Rejected' },
};

export default function AdminOrder() {
  const { dark } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await Get_orders();
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function toggleExpand(order) {
    if (expanded === order.id) {
      setExpanded(null);
      setDetail(null);
      return;
    }
    setExpanded(order.id);
    setDetailLoading(true);
    try {
      const res = await Get_order_by_id(order.id);
      if (res.success) setDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setUpdating(orderId);
    try {
      const res = await Update_order_status(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (detail && detail.id === orderId) {
          setDetail((prev) => ({ ...prev, status: newStatus }));
        }
        showToast(`Order #${orderId} updated to ${newStatus}`);
      } else {
        showToast(res.message || 'Failed to update', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(orderId) {
    try {
      const res = await Delete_order(orderId);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setExpanded(null);
        setDetail(null);
        showToast(`Order #${orderId} deleted`);
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    }
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      String(o.id).includes(search) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    revenue: orders
      .filter((o) => o.status !== 'rejected')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
  };

  const cardBg = dark ? '#0D1410' : '#F5F1E6';
  const borderColor = dark ? '#1C4D3A' : '#C9B99A';
  const mutedColor = dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)';
  const textColor = dark ? '#F0EAD8' : '#1A2620';
  const subtleBorder = dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)';

  return (
    <div className="w-full px-4 md:px-8 py-8" style={{ color: textColor }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-24 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 font-body text-sm shadow-lg rounded-md"
            style={{
              backgroundColor: toast.type === 'error' ? '#3A1414' : '#0F1C15',
              border: `1px solid ${toast.type === 'error' ? '#8B3A3A' : '#1C4D3A'}`,
              color: '#F0EAD8',
            }}
          >
            {toast.type === 'error' ? (
              <XCircle size={15} style={{ color: '#E08A8A' }} />
            ) : (
              <CheckCircle2 size={15} style={{ color: '#C9A864' }} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-12"
      >
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Package size={20} strokeWidth={1.5} style={{ color: '#C9A864' }} />
          </motion.div>
          <h1 className="font-heading text-2xl sm:text-3xl tracking-[0.12em] uppercase" style={{ color: '#C9A864' }}>
            Orders
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs mt-1.5 ml-8"
          style={{ color: mutedColor }}
        >
          {orders.length} total order{orders.length !== 1 ? 's' : ''} placed
        </motion.p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 mb-8 sm:mb-12">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, color: '#C9A864' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: '#C9A864' },
          { label: 'Delivered', value: stats.delivered, icon: CircleCheckBig, color: '#4CAF7D' },
          { label: 'Revenue', value: `৳${stats.revenue.toLocaleString()}`, icon: CreditCard, color: '#4CAF7D' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="flex items-center gap-3 sm:gap-5 px-4 sm:px-6 lg:px-7 py-4 sm:py-5 lg:py-6"
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-8 sm:mb-12 space-y-4 sm:space-y-5"
      >
        <div className="relative max-w-md w-full">
          
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 font-body text-sm outline-none transition-all duration-300"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, color: textColor }}
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
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {['all', ...STATUSES].map((s) => {
            const cfg = s === 'all' ? { color: '#C9A864', label: 'All' } : STATUS_CONFIG[s];
            const active = statusFilter === s;
            return (
              <motion.button
                key={s}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={() => setStatusFilter(s)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 font-body text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors duration-200"
                style={{
                  backgroundColor: active ? cfg.bg : 'transparent',
                  border: `1px solid ${active ? cfg.color : subtleBorder}`,
                  color: active ? cfg.color : mutedColor,
                }}
              >
                {cfg.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Order List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="font-body text-sm"
            style={{ color: mutedColor }}
          >
            Loading orders...
          </motion.p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center py-24"
        >
          <p className="font-body text-sm" style={{ color: mutedColor }}>No orders found</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((order, i) => {
              const isExpanded = expanded === order.id;
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.02, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group relative rounded-md p-[2px] overflow-hidden"
                >
                  {/* Simple animated border — rotates always, brightens on hover, brightest when expanded */}
                  
                  <motion.div
                    aria-hidden
                    className={`pointer-events-none absolute -inset-[45%] transition-opacity duration-300 ${
                      isExpanded ? '' : 'opacity-25 group-hover:opacity-60'
                    }`}
                
                    animate={{ rotate: 120 }}
                    transition={{ duration: 10, repeat: Infinity, ease:"linear" }}
                  />

                  {/* Card body — inset so only a crisp 2px ring of the animated border shows */}
                  <div className="relative rounded-[5px]" style={{ backgroundColor: cardBg }}>
                    {/* Order Row */}
                    <div
                      className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-5 px-4 sm:px-6 lg:px-7 py-4 sm:py-5 lg:py-6 cursor-pointer"
                      onClick={() => toggleExpand(order)}
                    >
                      {/* Left: Order ID + Customer */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.2 }}
                          className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center shrink-0 font-heading text-[10px] sm:text-xs"
                          style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                        >
                          #{order.id}
                        </motion.div>
                        <div className="min-w-0">
                          <p className="font-heading text-sm tracking-wide truncate">{order.customer_name}</p>
                          <p className="font-body text-xs truncate mt-1" style={{ color: mutedColor }}>
                            {order.customer_email}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Amount + Date */}
                      <div className="flex items-center gap-8 md:gap-10">
                        <div className="text-left">
                          <p className="font-heading text-base" style={{ color: '#C9A864' }}>
                            ৳{Number(order.total_amount).toLocaleString()}
                          </p>
                          <p className="font-body text-[10px] uppercase tracking-wider mt-1" style={{ color: mutedColor }}>
                            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </p>
                        </div>
                        <div className="text-left hidden sm:block">
                          <p className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="font-body text-[10px] mt-1" style={{ color: mutedColor }}>
                            {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Right: Status + Controls */}
                      <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 font-body text-[10px] uppercase tracking-wider"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          <StatusIcon size={12} strokeWidth={1.5} />
                          {cfg.label}
                        </span>

                        {/* Expand Arrow */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          style={{ color: mutedColor }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 lg:px-7 pb-6 sm:pb-7 lg:pb-8 pt-3" style={{ borderTop: `1px solid ${subtleBorder}` }}>
                            {detailLoading ? (
                              <p className="font-body text-xs py-6" style={{ color: mutedColor }}>Loading details...</p>
                            ) : detail ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-5">
                                {/* Left: Address */}
                                <div>
                                  <h4 className="flex items-center gap-2 font-heading text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: '#C9A864' }}>
                                    <MapPin size={13} /> Delivery Address
                                  </h4>
                                  <div className="space-y-2 pl-5">
                                    <p className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}>
                                      {detail.recipient_name} — {detail.delivery_phone}
                                    </p>
                                    <p className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                                      {detail.address_line1}{detail.address_line2 ? `, ${detail.address_line2}` : ''}
                                    </p>
                                    <p className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                                      {detail.city}{detail.district ? `, ${detail.district}` : ''}{detail.division ? `, ${detail.division}` : ''}
                                      {detail.postal_code ? ` - ${detail.postal_code}` : ''}
                                    </p>
                                  </div>

                                  {/* Items */}
                                  <h4 className="flex items-center gap-2 font-heading text-[10px] tracking-[0.2em] uppercase mt-7 mb-4" style={{ color: '#C9A864' }}>
                                    <ShoppingBag size={13} /> Items
                                  </h4>
                                  <div className="space-y-3.5 pl-5">
                                    {detail.items?.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between">
                                        <div>
                                          <p className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}>
                                            {item.item_name}
                                            {item.volume_ml ? ` (${item.volume_ml}ml)` : ''}
                                          </p>
                                          <p className="font-body text-[10px] mt-0.5" style={{ color: mutedColor }}>
                                            Perfume × {item.quantity}
                                          </p>
                                        </div>
                                        <p className="font-body text-xs" style={{ color: '#C9A864' }}>
                                          ৳{(Number(item.unit_price) * item.quantity).toLocaleString()}
                                        </p>
                                      </div>
                                    ))}

                                    {detail.bottles?.map((item, idx) => (
                                      <div key={`b-${idx}`} className="flex items-center justify-between">
                                        <div>
                                          <p className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}>
                                            {item.item_name}
                                            {item.volume ? ` (${item.volume})` : ''}
                                          </p>
                                          <p className="font-body text-[10px] mt-0.5" style={{ color: mutedColor }}>
                                            Bottle × {item.quantity}
                                          </p>
                                        </div>
                                        <p className="font-body text-xs" style={{ color: '#C9A864' }}>
                                          ৳{(Number(item.unit_price) * item.quantity).toLocaleString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Right: Status Controls */}
                                <div>
                                  <h4 className="font-heading text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: '#C9A864' }}>
                                    Update Status
                                  </h4>
                                  <div className="space-y-2.5">
                                    {STATUSES.map((s) => {
                                      const sc = STATUS_CONFIG[s];
                                      const SIcon = sc.icon;
                                      const isCurrent = order.status === s;
                                      return (
                                        <motion.button
                                          key={s}
                                          whileHover={!isCurrent ? { x: 3 } : {}}
                                          whileTap={!isCurrent ? { scale: 0.98 } : {}}
                                          transition={{ duration: 0.15, ease: 'easeOut' }}
                                          disabled={isCurrent || updating === order.id}
                                          onClick={() => handleStatusChange(order.id, s)}
                                          className="w-full flex items-center gap-3 px-4 py-3.5 font-body text-xs uppercase tracking-wider transition-colors duration-200 text-left disabled:opacity-40"
                                          style={{
                                            backgroundColor: isCurrent ? sc.bg : 'transparent',
                                            border: `1px solid ${isCurrent ? sc.color : subtleBorder}`,
                                            color: isCurrent ? sc.color : mutedColor,
                                            cursor: isCurrent ? 'default' : 'pointer',
                                          }}
                                          onMouseEnter={(e) => {
                                            if (isCurrent) return;
                                            e.currentTarget.style.borderColor = sc.color;
                                            e.currentTarget.style.color = sc.color;
                                            e.currentTarget.style.backgroundColor = sc.bg;
                                          }}
                                          onMouseLeave={(e) => {
                                            if (isCurrent) return;
                                            e.currentTarget.style.borderColor = subtleBorder;
                                            e.currentTarget.style.color = mutedColor;
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                          }}
                                        >
                                          <SIcon size={14} strokeWidth={1.5} />
                                          <span className="flex-1">{sc.label}</span>
                                          {isCurrent && <span className="text-[9px]">Current</span>}
                                        </motion.button>
                                      );
                                    })}
                                  </div>

                                  {/* Delete */}
                                  <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    onClick={() => handleDelete(order.id)}
                                    className="w-full flex items-center justify-center gap-2 mt-5 px-4 py-3 font-body text-[10px] uppercase tracking-wider transition-colors duration-200"
                                    style={{ border: `1px solid rgba(181,80,79,0.3)`, color: '#B5504F', backgroundColor: 'rgba(181,80,79,0.04)' }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = 'rgba(181,80,79,0.16)';
                                      e.currentTarget.style.borderColor = 'rgba(181,80,79,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'rgba(181,80,79,0.04)';
                                      e.currentTarget.style.borderColor = 'rgba(181,80,79,0.3)';
                                    }}
                                  >
                                    <Trash2 size={12} /> Delete Order
                                  </motion.button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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