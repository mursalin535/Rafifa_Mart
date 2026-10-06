import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  Get_offers, Add_offer, Update_offer, Delete_offer,
  Get_all_product_offers, Assign_offer, Remove_offer_from_product,
  Upload_offer_thumbnail
} from '../Server/offer';
import { Get_products } from '../Server/product';
import { Plus, Search, Trash2, Edit3, X, Tag, Eye, Check, ChevronRight, Upload, Image as ImageIcon } from 'lucide-react';

const API_BASE = 'http://localhost:5007';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 30 } },
  exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.2, ease: 'easeIn' } },
};

const EMPTY_FORM = {
  offer_name: '', title: '', punchline: '', thumbnail: '',
  discount_type: 'flat', discount_value: '',
  valid_from: '', valid_until: '',
};

function DropZone({ value, onChange, dark }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const res = await Upload_offer_thumbnail(file);
      if (res?.success && res?.data?.url) {
        onChange(res.data.url);
      }
    } catch { /* ignore */ }
    finally { setUploading(false); }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() { setDragging(false); }

  function onPick(e) {
    const file = e.target.files[0];
    handleFile(file);
    e.target.value = '';
  }

  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
        Thumbnail Image
      </label>
      {value ? (
        <div className="relative w-full h-40 rounded-sm overflow-hidden group" style={{ backgroundColor: dark ? '#0A0F0C' : '#EDE8D8' }}>
          <img src={`${API_BASE}${value}`} alt="Thumbnail" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#F0EAD8' }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileRef.current?.click()}
          className="w-full h-40 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
          style={{
            border: `2px dashed ${dragging ? '#C9A864' : dark ? '#1C4D3A' : '#C9B99A'}`,
            backgroundColor: dragging ? 'rgba(201,168,100,0.05)' : dark ? '#0D1410' : '#F5F1E6',
          }}
        >
          {uploading ? (
            <span className="font-body text-xs" style={{ color: '#C9A864' }}>Uploading...</span>
          ) : (
            <>
              <Upload size={22} style={{ color: 'rgba(201,168,100,0.4)' }} />
              <span className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}>
                Drag & drop an image here
              </span>
              <span className="font-body text-[10px]" style={{ color: 'rgba(201,168,100,0.35)' }}>
                or click to browse
              </span>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
        </div>
      )}
    </div>
  );
}

export default function AdminOffer() {
  const { dark } = useTheme();
  const [offers, setOffers] = useState([]);
  const [allProductOffers, setAllProductOffers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const [assignSearch, setAssignSearch] = useState('');

  const inputStyle = {
    backgroundColor: dark ? '#0D1410' : '#F5F1E6',
    border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
    color: dark ? '#F0EAD8' : '#1A2620',
  };

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [offersRes, productOffersRes, productsRes] = await Promise.all([
        Get_offers(),
        Get_all_product_offers(),
        Get_products(),
      ]);
      setOffers(offersRes?.data ?? []);
      setAllProductOffers(productOffersRes?.data ?? []);
      setAllProducts(Array.isArray(productsRes) ? productsRes : productsRes?.data ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    if (!search) return offers;
    const q = search.toLowerCase();
    return offers.filter(o =>
      o.offer_name?.toLowerCase().includes(q) ||
      o.title?.toLowerCase().includes(q)
    );
  }, [offers, search]);

  const getOfferProductCount = (offerId) => allProductOffers.filter(po => po.offer_id === offerId).length;
  const getOfferProducts = (offerId) => allProductOffers.filter(po => po.offer_id === offerId);

  const stats = useMemo(() => ({
    total: offers.length,
    active: offers.filter(o => {
      if (!o.valid_from || !o.valid_until) return true;
      const now = new Date();
      return new Date(o.valid_from) <= now && new Date(o.valid_until) >= now;
    }).length,
    totalAssignments: allProductOffers.length,
  }), [offers, allProductOffers]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() { setForm(EMPTY_FORM); setSelected(null); setModal('add'); }
  function openEdit(offer) {
    setForm({
      offer_name: offer.offer_name ?? '',
      title: offer.title ?? '',
      punchline: offer.punchline ?? '',
      thumbnail: offer.thumbnail ?? '',
      discount_type: offer.discount_type,
      discount_value: String(offer.discount_value),
      valid_from: offer.valid_from ?? '',
      valid_until: offer.valid_until ?? '',
    });
    setSelected(offer);
    setModal('edit');
  }
  function openDelete(offer) { setSelected(offer); setModal('delete'); }
  function openView(offer) { setSelected(offer); setModal('view'); }
  function openAssign(offer) { setSelected(offer); setAssignSearch(''); setModal('assign'); }

  function handleFormChange(key, val) { setForm(prev => ({ ...prev, [key]: val })); }

  async function handleSave() {
    if (!form.offer_name || !form.discount_value) return;
    setSaving(true);
    try {
      const payload = { ...form, discount_value: Number(form.discount_value) };
      if (modal === 'add') {
        await Add_offer(payload);
        showToast('Offer created');
      } else {
        await Update_offer(selected.id, payload);
        showToast('Offer updated');
      }
      await fetchData();
      setModal(null);
    } catch { showToast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await Delete_offer(selected.id);
      showToast('Offer deleted');
      await fetchData();
      setModal(null);
    } catch { showToast('Failed to delete', 'error'); }
  }

  async function handleAssign(productId) {
    try {
      await Assign_offer(productId, selected.id);
      showToast('Product assigned');
      const res = await Get_all_product_offers();
      setAllProductOffers(res?.data ?? []);
    } catch { showToast('Failed to assign', 'error'); }
  }

  async function handleUnassign(productId) {
    try {
      await Remove_offer_from_product(productId, selected.id);
      showToast('Product removed');
      const res = await Get_all_product_offers();
      setAllProductOffers(res?.data ?? []);
    } catch { showToast('Failed to remove', 'error'); }
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function isExpired(offer) {
    if (!offer.valid_until) return false;
    return new Date(offer.valid_until) < new Date();
  }

  return (
    <div className="w-full px-4 md:px-8 py-6" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[60] px-5 py-3 rounded-lg font-body text-sm shadow-lg"
            style={{
              backgroundColor: toast.type === 'error' ? '#5C1A1A' : '#1C4D3A',
              color: '#F0EAD8',
              border: `1px solid ${toast.type === 'error' ? '#8A3A3A' : '#2A6B4A'}`,
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Tag size={18} strokeWidth={1.5} style={{ color: '#C9A864' }} />
          </motion.div>
          <h2 className="font-heading text-base sm:text-lg tracking-[0.15em] uppercase" style={{ color: '#C9A864' }}>
            Offers
          </h2>
          <span className="font-body text-[10px] sm:text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(201,168,100,0.12)', color: '#C9A864' }}>
            {offers.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search offers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-9 pr-4 py-2 sm:py-2.5 font-body text-[11px] sm:text-xs outline-none rounded-sm"
              style={inputStyle}
            />
          </div>
          <motion.button
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-heading text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-sm whitespace-nowrap"
            style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
          >
            <Plus size={14} /> New Offer
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
        {[
          { label: 'Total Offers', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Assignments', value: stats.totalAssignments },
        ].map((s) => (
          <div key={s.label} className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-sm" style={{ backgroundColor: dark ? '#0D1410' : '#F5F1E6', border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-body block" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>{s.label}</span>
            <span className="font-heading text-sm sm:text-base" style={{ color: '#C9A864' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Offer List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-sm animate-pulse" style={{ backgroundColor: dark ? '#0D1410' : '#F5F1E6', border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A20'}` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3">
          <Tag size={32} style={{ color: 'rgba(201,168,100,0.2)' }} />
          <span className="font-body text-[11px] sm:text-xs" style={{ color: dark ? 'rgba(237,231,218,0.3)' : 'rgba(26,38,32,0.3)' }}>
            {search ? 'No offers match your search.' : 'No offers yet. Create your first offer.'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filtered.map((offer, i) => {
            const expired = isExpired(offer);
            const productCount = getOfferProductCount(offer.id);
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: dark ? '#0D1410' : '#F5F1E6',
                  border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  opacity: expired ? 0.5 : 1,
                }}
              >
                {/* Image Area - hover reveals actions */}
                <div className="relative w-full h-40 sm:h-44 lg:h-52 overflow-hidden" style={{ backgroundColor: dark ? '#0A0F0C' : '#EDE8D8' }}>
                  {offer.thumbnail ? (
                    <img src={`${API_BASE}${offer.thumbnail}`} alt={offer.offer_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag size={40} style={{ color: 'rgba(201,168,100,0.12)' }} />
                    </div>
                  )}

                  {/* Expired badge */}
                  {expired && (
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm font-body"
                      style={{ backgroundColor: 'rgba(138,58,58,0.85)', color: '#F0EAD8', backdropFilter: 'blur(4px)' }}>
                      Expired
                    </span>
                  )}

                  {/* Discount badge */}
                  <span className="absolute top-3 right-3 font-heading text-sm px-3 py-1 rounded-sm"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#C9A864', backdropFilter: 'blur(4px)' }}>
                    {offer.discount_type === 'flat' ? '৳' : ''}{offer.discount_value}{offer.discount_type === 'percentage' ? '%' : ''}
                  </span>

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openView(offer)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                        style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#F0EAD8', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                        <Eye size={11} /> View
                      </button>
                      <button onClick={() => openAssign(offer)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                        style={{ backgroundColor: 'rgba(201,168,100,0.25)', color: '#C9A864', border: '1px solid rgba(201,168,100,0.3)', backdropFilter: 'blur(4px)' }}>
                        <ChevronRight size={11} /> Assign
                      </button>
                      <button onClick={() => openEdit(offer)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                        style={{ backgroundColor: 'rgba(201,168,100,0.25)', color: '#C9A864', border: '1px solid rgba(201,168,100,0.3)', backdropFilter: 'blur(4px)' }}>
                        <Edit3 size={11} /> Edit
                      </button>
                      <button onClick={() => openDelete(offer)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                        style={{ backgroundColor: 'rgba(138,58,58,0.3)', color: '#F0EAD8', border: '1px solid rgba(138,58,58,0.4)', backdropFilter: 'blur(4px)' }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Below Image */}
                <div className="p-5 sm:p-6 lg:p-7">
                  {/* Name + Title */}
                  <h3 className="font-heading text-[15px] sm:text-[16px] lg:text-[17px] leading-snug" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                    {offer.offer_name || 'Unnamed Offer'}
                  </h3>
                  {offer.title && (
                    <p className="font-body text-[12px] mt-1" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                      {offer.title}
                    </p>
                  )}

                  {/* Punchline */}
                  {offer.punchline && (
                    <p className="font-body text-[12px] leading-relaxed mt-3 line-clamp-2 italic" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                      "{offer.punchline}"
                    </p>
                  )}

                  {/* Dates & Product Count */}
                  <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}` }}>
                    <div className="font-body text-[11px]" style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}>
                      {formatDate(offer.valid_from)} — {formatDate(offer.valid_until)}
                    </div>
                    <span className="font-body text-[11px] px-2.5 py-1 rounded-sm"
                      style={{ backgroundColor: 'rgba(201,168,100,0.1)', color: '#C9A864' }}>
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══════════ MODALS ═══════════ */}
      <AnimatePresence>
        {modal && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setModal(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[90vh] overflow-hidden rounded-sm flex flex-col"
              style={{
                maxWidth: modal === 'assign' ? '640px' : modal === 'view' ? '520px' : modal === 'delete' ? '440px' : '640px',
                backgroundColor: dark ? '#0F1A15' : '#FAF7F0',
                border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 shrink-0" style={{ borderBottom: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}` }}>
                <h3 className="font-heading text-base tracking-[0.15em] uppercase" style={{ color: '#C9A864' }}>
                  {modal === 'add' ? 'New Offer' : modal === 'edit' ? 'Edit Offer' : modal === 'delete' ? 'Delete Offer' : modal === 'assign' ? 'Assign Products' : 'Offer Details'}
                </h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-sm transition-colors" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 130px)' }}>

                {/* VIEW */}
                {modal === 'view' && selected && (
                  <div className="space-y-4">
                    {selected.thumbnail && (
                      <div className="w-full h-44 rounded-sm overflow-hidden" style={{ backgroundColor: dark ? '#0A0F0C' : '#EDE8D8' }}>
                        <img src={`${API_BASE}${selected.thumbnail}`} alt={selected.offer_name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {[
                      ['Name', selected.offer_name],
                      ['Title', selected.title],
                      ['Punchline', selected.punchline],
                      ['Discount', selected.discount_type === 'flat' ? `৳${selected.discount_value} flat` : `${selected.discount_value}% off`],
                      ['Valid From', formatDate(selected.valid_from)],
                      ['Valid Until', formatDate(selected.valid_until)],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: `1px solid ${dark ? '#1C4D3A20' : '#C9B99A20'}` }}>
                        <span className="font-body text-xs uppercase tracking-wider" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>{label}</span>
                        <span className="font-body text-xs text-right max-w-[60%]" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>{value}</span>
                      </div>
                    ))}
                    {getOfferProducts(selected.id).length > 0 && (
                      <div className="mt-5">
                        <span className="font-body text-xs uppercase tracking-wider block mb-3" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                          Assigned Products ({getOfferProducts(selected.id).length})
                        </span>
                        <div className="space-y-2">
                          {getOfferProducts(selected.id).map(po => (
                            <div key={po.product_id} className="flex items-center justify-between py-2 px-3 rounded-sm"
                              style={{ backgroundColor: dark ? '#0D1410' : '#F5F1E6', border: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}` }}>
                              <span className="font-body text-xs" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>{po.product_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ADD / EDIT */}
                {(modal === 'add' || modal === 'edit') && (
                  <div className="space-y-6">
                    {/* Thumbnail Drop Zone */}
                    <DropZone value={form.thumbnail} onChange={(v) => handleFormChange('thumbnail', v)} dark={dark} />

                    {/* Row: Offer Name + Title */}
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Offer Name *</label>
                        <input
                          type="text"
                          value={form.offer_name}
                          onChange={(e) => handleFormChange('offer_name', e.target.value)}
                          placeholder="e.g. Summer Sale"
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Title</label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          placeholder="Short heading"
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-sm"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Punchline */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Punchline</label>
                      <input
                        type="text"
                        value={form.punchline}
                        onChange={(e) => handleFormChange('punchline', e.target.value)}
                        placeholder="A catchy line..."
                        className="w-full px-4 py-3 font-body text-xs outline-none rounded-sm"
                        style={inputStyle}
                      />
                    </div>

                    {/* Row: Discount Type + Value */}
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Discount Type</label>
                        <div className="flex gap-3">
                          {['flat', 'percentage'].map((t) => (
                            <button
                              key={t}
                              onClick={() => handleFormChange('discount_type', t)}
                              className="flex-1 py-3 rounded-sm text-[11px] uppercase tracking-wider font-heading transition-all"
                              style={{
                                border: `1px solid ${form.discount_type === t ? '#C9A864' : dark ? '#1C4D3A' : '#C9B99A'}`,
                                backgroundColor: form.discount_type === t ? 'rgba(201,168,100,0.12)' : 'transparent',
                                color: form.discount_type === t ? '#C9A864' : dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)',
                              }}
                            >
                              {t === 'flat' ? '৳ Flat' : '% Percentage'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Discount Value *</label>
                        <input
                          type="number"
                          value={form.discount_value}
                          onChange={(e) => handleFormChange('discount_value', e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-sm"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Row: Valid From + Valid Until */}
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Valid From</label>
                        <input
                          type="date"
                          value={form.valid_from}
                          onChange={(e) => handleFormChange('valid_from', e.target.value)}
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Valid Until</label>
                        <input
                          type="date"
                          value={form.valid_until}
                          onChange={(e) => handleFormChange('valid_until', e.target.value)}
                          className="w-full px-4 py-3 font-body text-xs outline-none rounded-sm"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* DELETE */}
                {modal === 'delete' && selected && (
                  <div className="text-center py-6">
                    <Trash2 size={36} className="mx-auto mb-4" style={{ color: '#8A3A3A' }} />
                    <p className="font-body text-sm" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                      Delete <span className="font-heading" style={{ color: '#C9A864' }}>{selected.offer_name}</span>?
                    </p>
                    <p className="font-body text-xs mt-2" style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}>
                      This will also remove all product assignments.
                    </p>
                  </div>
                )}

                {/* ASSIGN PRODUCTS */}
                {modal === 'assign' && selected && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(201,168,100,0.4)' }} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={assignSearch}
                        onChange={(e) => setAssignSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 font-body text-xs outline-none rounded-sm"
                        style={inputStyle}
                      />
                    </div>

                    {/* Currently Assigned */}
                    {getOfferProducts(selected.id).length > 0 && (
                      <div>
                        <span className="font-body text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                          Assigned ({getOfferProducts(selected.id).length})
                        </span>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {getOfferProducts(selected.id)
                            .filter(po => {
                              if (!assignSearch) return true;
                              const product = allProducts.find(p => p.id === po.product_id);
                              return product?.name?.toLowerCase().includes(assignSearch.toLowerCase());
                            })
                            .map(po => {
                              const product = allProducts.find(p => p.id === po.product_id);
                              return (
                                <div
                                  key={po.product_id}
                                  className="flex items-center justify-between py-3 px-4 rounded-sm"
                                  style={{
                                    backgroundColor: 'rgba(201,168,100,0.08)',
                                    border: '1px solid rgba(201,168,100,0.2)',
                                  }}
                                >
                                  <span className="font-body text-xs truncate" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                                    {product?.name || 'Unknown product'}
                                  </span>
                                  <button
                                    onClick={() => handleUnassign(po.product_id)}
                                    className="shrink-0 ml-3 flex items-center gap-1.5 py-1.5 px-3 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                                    style={{
                                      backgroundColor: 'rgba(138,58,58,0.12)',
                                      color: '#8A3A3A',
                                      border: '1px solid rgba(138,58,58,0.2)',
                                    }}
                                  >
                                    <X size={10} /> Remove
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Available to Assign */}
                    <div>
                      <span className="font-body text-[10px] uppercase tracking-[0.2em] block mb-2" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                        Available
                      </span>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {allProducts
                          .filter(p => {
                            const assignedToAnyOffer = allProductOffers.some(po => po.product_id === p.id);
                            if (assignedToAnyOffer) return false;
                            if (!assignSearch) return true;
                            return p.name?.toLowerCase().includes(assignSearch.toLowerCase());
                          })
                          .map(product => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between py-3 px-4 rounded-sm transition-colors"
                              style={{
                                backgroundColor: dark ? '#0D1410' : '#F5F1E6',
                                border: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}`,
                              }}
                            >
                              <span className="font-body text-xs truncate" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                                {product.name}
                              </span>
                              <button
                                onClick={() => handleAssign(product.id)}
                                className="shrink-0 ml-3 flex items-center gap-1.5 py-1.5 px-3 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                                style={{
                                  backgroundColor: 'rgba(201,168,100,0.12)',
                                  color: '#C9A864',
                                  border: '1px solid rgba(201,168,100,0.2)',
                                }}
                              >
                                <Check size={10} /> Assign
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {(modal === 'add' || modal === 'edit' || modal === 'delete') && (
                <div className="flex items-center gap-4 px-8 py-5 shrink-0" style={{ borderTop: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}` }}>
                  <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-sm font-body text-[11px] uppercase tracking-wider transition-colors"
                    style={{ border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`, color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={modal === 'delete' ? handleDelete : handleSave}
                    disabled={saving || (modal !== 'delete' && (!form.offer_name || !form.discount_value))}
                    className="flex-1 py-3 rounded-sm font-heading text-[11px] uppercase tracking-wider transition-colors disabled:opacity-30"
                    style={{
                      backgroundColor: modal === 'delete' ? '#8A3A3A' : '#C9A864',
                      color: modal === 'delete' ? '#F0EAD8' : '#0A0A0A',
                    }}
                  >
                    {saving ? 'Saving...' : modal === 'delete' ? 'Delete' : modal === 'add' ? 'Create Offer' : 'Save Changes'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
