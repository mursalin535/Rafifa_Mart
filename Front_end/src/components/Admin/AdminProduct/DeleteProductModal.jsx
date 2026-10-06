import { motion } from 'framer-motion';
import { TriangleAlert, Trash2 } from 'lucide-react';

export default function DeleteProductModal({ selected, saving, dark, onCancel, onConfirm }) {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-2.5 mb-4"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-9 h-9 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(181,80,79,0.12)', color: '#B5504F' }}
        >
          <TriangleAlert size={18} />
        </motion.div>
        <h2 className="font-heading text-lg tracking-[0.1em] uppercase" style={{ color: '#B5504F' }}>
          Delete Product
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-body text-sm mb-6 leading-relaxed"
        style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}
      >
        Are you sure you want to delete{' '}
        <strong style={{ color: '#C9A864' }}>{selected?.name}</strong>? This
        will also remove all its images, ratings, and offers. This action cannot be undone.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex justify-end gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="px-4 py-2 font-heading text-[11px] tracking-[0.15em] uppercase transition-colors duration-200"
          style={{
            border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
            color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)',
          }}
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(181,80,79,0.25)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 font-heading text-[11px] tracking-[0.15em] uppercase disabled:opacity-50 transition-shadow duration-300"
          style={{ backgroundColor: '#5C1A1A', color: '#F0EAD8' }}
        >
          <motion.div
            animate={saving ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Trash2 size={13} />
          </motion.div>
          {saving ? 'Deleting...' : 'Delete'}
        </motion.button>
      </motion.div>
    </div>
  );
}
