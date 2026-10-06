import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Get_bottles, Add_bottle, Update_bottle, Delete_bottle } from '../Server/bottle';
import { Plus, Search, Trash2, Edit3, X, Package, Eye } from 'lucide-react';

const VOLUMES = ['3ml', '6ml', '8ml', '12ml'];

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

const EMPTY_FORM = { name: '', photo_url: '', total_piece: '', volume: '12ml', price_per_piece: '', description: '' };

function BottleSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 50 80" fill="none" className={className}>
      <path d="M25 3 C22 3,20 6,20 10 L20 18 C15 20,12 25,12 31 L12 62 C12 68,16 72,22 72 L28 72 C34 72,38 68,38 62 L38 31 C38 25,35 20,30 18 L30 10 C30 6,28 3,25 3Z"
        stroke="#C9A864" strokeWidth="1.3" />
      <rect x="20" y="0" width="10" height="5" rx="1.5" stroke="#C9A864" strokeWidth="1" />
    </svg>
  );
}

export default function AdminBottle() {
  const { dark } = useTheme();
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete' | 'view' | null
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [saving, setSaving] = useState(false);

  const inputStyle = {
    backgroundColor: dark ? '#0D1410' : '#F5F1E6',
    border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
    color: dark ? '#F0EAD8' : '#1A2620',
  };

  useEffect(() => { fetchBottles(); }, []);

  async function fetchBottles() {
    setLoading(true);
    try {
      const res = await Get_bottles();
      setBottles(Array.isArray(res) ? res : res?.data ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    if (!search) return bottles;
    const q = search.toLowerCase();
    return bottles.filter(b => b.name?.toLowerCase().includes(q) || b.volume?.toLowerCase().includes(q));
  }, [bottles, search]);

  const stats = useMemo(() => ({
    total: bottles.length,
    totalPieces: bottles.reduce((s, b) => s + (b.total_piece || 0), 0),
    avgPrice: bottles.length ? Math.round(bottles.reduce((s, b) => s + Number(b.price_per_piece || 0), 0) / bottles.length) : 0,
  }), [bottles]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() { setForm(EMPTY_FORM); setSelectedBottle(null); setModal('add'); }
  function openEdit(bottle) { setForm({ ...bottle, total_piece: String(bottle.total_piece), price_per_piece: String(bottle.price_per_piece) }); setSelectedBottle(bottle); setModal('edit'); }
  function openDelete(bottle) { setSelectedBottle(bottle); setModal('delete'); }
  function openView(bottle) { setSelectedBottle(bottle); setModal('view'); }

  function handleFormChange(key, val) { setForm(prev => ({ ...prev, [key]: val })); }

  async function handleSave() {
    if (!form.name || !form.volume || !form.price_per_piece) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        total_piece: Number(form.total_piece) || 0,
        price_per_piece: Number(form.price_per_piece) || 0,
      };

      if (modal === 'add') {
        await Add_bottle(payload);
        showToast('Bottle added successfully');
      } else {
        await Update_bottle(selectedBottle.id, payload);
        showToast('Bottle updated successfully');
      }
      await fetchBottles();
      setModal(null);
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await Delete_bottle(selectedBottle.id);
      showToast('Bottle deleted successfully');
      await fetchBottles();
      setModal(null);
    } catch { showToast('Failed to delete bottle', 'error'); }
  }

  return (
    <div className="w-full px-4 md:px-8 py-6" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>

      {/* Toast */}
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
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 sm:mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Package size={18} strokeWidth={1.5} style={{ color: '#C9A864' }} />
          </motion.div>
          <h2 className="font-heading text-base sm:text-lg tracking-[0.15em] uppercase" style={{ color: '#C9A864' }}>
            Bottles
          </h2>
          <span className="font-body text-[10px] sm:text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(201,168,100,0.12)', color: '#C9A864' }}>
            {bottles.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search bottles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-9 pr-4 py-2 sm:py-2.5 font-body text-[11px] sm:text-xs outline-none rounded-sm transition-all focus:ring-1"
              style={{ ...inputStyle, focusRingColor: '#C9A864' }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-heading text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-sm whitespace-nowrap"
            style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
          >
            <Plus size={14} /> <span className="hidden xs:inline">Add</span>Bottle
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
        {[
          { label: 'Total Bottles', value: stats.total },
          { label: 'Total Pieces', value: stats.totalPieces },
          { label: 'Avg Price', value: `৳${stats.avgPrice}` },
        ].map((s) => (
          <div key={s.label} className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-sm" style={{ backgroundColor: dark ? '#0D1410' : '#F5F1E6', border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-body block" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>{s.label}</span>
            <span className="font-heading text-sm sm:text-base" style={{ color: '#C9A864' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-sm animate-pulse" style={{ backgroundColor: dark ? '#0D1410' : '#F5F1E6', border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A20'}` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Package size={32} style={{ color: 'rgba(201,168,100,0.2)' }} />
          <span className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.3)' : 'rgba(26,38,32,0.3)' }}>
            {search ? 'No bottles match your search.' : 'No bottles yet. Add your first bottle.'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((bottle, i) => (
            <motion.div
              key={bottle.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: dark ? '#0D1410' : '#F5F1E6',
                border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              {/* Image Area - hover reveals actions */}
              <div className="relative w-full h-52 overflow-hidden" style={{ backgroundColor: dark ? '#0A0F0C' : '#EDE8D8' }}>
                {bottle.photo_url ? (
                  <img src={bottle.photo_url} alt={bottle.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BottleSVG className="w-16 h-24 opacity-20" />
                  </div>
                )}

                {/* Volume badge */}
                <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm font-body"
                  style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#C9A864', backdropFilter: 'blur(4px)' }}>
                  {bottle.volume}
                </span>

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openView(bottle)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#F0EAD8', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                      <Eye size={11} /> View
                    </button>
                    <button onClick={() => openEdit(bottle)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                      style={{ backgroundColor: 'rgba(201,168,100,0.25)', color: '#C9A864', border: '1px solid rgba(201,168,100,0.3)', backdropFilter: 'blur(4px)' }}>
                      <Edit3 size={11} /> Edit
                    </button>
                    <button onClick={() => openDelete(bottle)} className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-sm text-[10px] uppercase tracking-wider font-body transition-colors"
                      style={{ backgroundColor: 'rgba(138,58,58,0.3)', color: '#F0EAD8', border: '1px solid rgba(138,58,58,0.4)', backdropFilter: 'blur(4px)' }}>
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Below Image */}
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="font-heading text-[13px] sm:text-[14px] lg:text-[15px] leading-snug" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                  {bottle.name}
                </h3>
                <div className="flex items-center justify-between mt-2.5 sm:mt-3">
                  <span className="font-heading text-sm sm:text-base lg:text-lg" style={{ color: '#C9A864' }}>৳{bottle.price_per_piece}</span>
                  <span className="font-body text-[10px] sm:text-[11px]" style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}>
                    {bottle.total_piece} pcs
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
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
              className="w-full max-w-lg rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: dark ? '#0F1A15' : '#FAF7F0', border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}` }}>
                <h3 className="font-heading text-sm tracking-[0.15em] uppercase" style={{ color: '#C9A864' }}>
                  {modal === 'add' ? 'Add New Bottle' : modal === 'edit' ? 'Edit Bottle' : modal === 'delete' ? 'Delete Bottle' : 'Bottle Details'}
                </h3>
                <button onClick={() => setModal(null)} className="p-1 rounded-sm transition-colors" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5">

                {/* VIEW */}
                {modal === 'view' && selectedBottle && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full h-48 rounded-sm overflow-hidden" style={{ backgroundColor: dark ? '#0A0F0C' : '#EDE8D8' }}>
                      {selectedBottle.photo_url ? (
                        <img src={selectedBottle.photo_url} alt={selectedBottle.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><BottleSVG className="w-16 h-24 opacity-20" /></div>
                      )}
                    </div>
                    <div className="w-full space-y-2">
                      {[
                        ['Name', selectedBottle.name],
                        ['Volume', selectedBottle.volume],
                        ['Price', `৳${selectedBottle.price_per_piece}`],
                        ['Stock', `${selectedBottle.total_piece} pieces`],
                        ['Description', selectedBottle.description || '—'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${dark ? '#1C4D3A20' : '#C9B99A20'}` }}>
                          <span className="font-body text-[11px] uppercase tracking-wider" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>{label}</span>
                          <span className="font-body text-xs text-right max-w-[60%]" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADD / EDIT */}
                {(modal === 'add' || modal === 'edit') && (
                  <div className="space-y-4">
                    {[
                      { key: 'name', label: 'Bottle Name', placeholder: 'e.g. Classic Glass Bottle', type: 'text' },
                      { key: 'photo_url', label: 'Photo URL', placeholder: 'https://...', type: 'text' },
                      { key: 'price_per_piece', label: 'Price (৳)', placeholder: '0', type: 'number' },
                      { key: 'total_piece', label: 'Stock (pieces)', placeholder: '0', type: 'number' },
                    ].map(({ key, label, placeholder, type }) => (
                      <div key={key}>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-1.5" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>{label}</label>
                        <input
                          type={type}
                          value={form[key]}
                          onChange={(e) => handleFormChange(key, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-3 py-2.5 font-body text-xs outline-none rounded-sm transition-all focus:ring-1"
                          style={inputStyle}
                        />
                      </div>
                    ))}

                    {/* Volume select */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-1.5" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Volume</label>
                      <div className="flex gap-2">
                        {VOLUMES.map((v) => (
                          <button
                            key={v}
                            onClick={() => handleFormChange('volume', v)}
                            className="flex-1 py-2 rounded-sm text-[11px] uppercase tracking-wider font-heading transition-all"
                            style={{
                              border: `1px solid ${form.volume === v ? '#C9A864' : dark ? '#1C4D3A' : '#C9B99A'}`,
                              backgroundColor: form.volume === v ? 'rgba(201,168,100,0.12)' : 'transparent',
                              color: form.volume === v ? '#C9A864' : dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)',
                            }}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-body block mb-1.5" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        placeholder="Describe this bottle..."
                        rows={3}
                        className="w-full px-3 py-2.5 font-body text-xs outline-none rounded-sm resize-none transition-all focus:ring-1"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* DELETE */}
                {modal === 'delete' && selectedBottle && (
                  <div className="text-center py-4">
                    <Trash2 size={32} className="mx-auto mb-3" style={{ color: '#8A3A3A' }} />
                    <p className="font-body text-sm" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                      Delete <span className="font-heading" style={{ color: '#C9A864' }}>{selectedBottle.name}</span>?
                    </p>
                    <p className="font-body text-xs mt-1" style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}>
                      This action cannot be undone.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              {(modal === 'add' || modal === 'edit' || modal === 'delete') && (
                <div className="flex items-center gap-3 px-6 py-4" style={{ borderTop: `1px solid ${dark ? '#1C4D3A30' : '#C9B99A30'}` }}>
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-sm font-body text-[11px] uppercase tracking-wider transition-colors"
                    style={{ border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`, color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={modal === 'delete' ? handleDelete : handleSave}
                    disabled={saving || (modal !== 'delete' && (!form.name || !form.price_per_piece))}
                    className="flex-1 py-2.5 rounded-sm font-heading text-[11px] uppercase tracking-wider transition-colors disabled:opacity-30"
                    style={{
                      backgroundColor: modal === 'delete' ? '#8A3A3A' : '#C9A864',
                      color: modal === 'delete' ? '#F0EAD8' : '#0A0A0A',
                    }}
                  >
                    {saving ? 'Saving...' : modal === 'delete' ? 'Delete' : modal === 'add' ? 'Add Bottle' : 'Save Changes'}
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
