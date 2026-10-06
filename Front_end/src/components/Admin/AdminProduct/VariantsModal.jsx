import { motion, AnimatePresence } from 'framer-motion';
import { X, PackageOpen, Check } from 'lucide-react';

const variantItemVariants = {
  hidden: { opacity: 0, x: -16, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 16, scale: 0.95 },
};

export default function VariantsModal({
  selected,
  variants,
  variantStockEdits,
  setVariantStockEdits,
  saving,
  dark,
  inputStyle,
  onUpdateStock,
  onClose,
}) {
  const atarVariants = variants.filter((v) => v.packaging_type === 'atar');
  const sprayVariants = variants.filter((v) => v.packaging_type === 'spray');

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1"
      >
        <h2 className="font-heading text-lg tracking-[0.1em] uppercase" style={{ color: '#C9A864' }}>
          Variants
        </h2>
        <p className="font-body text-xs mt-1" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
          {selected?.name}
        </p>
      </motion.div>

      {variants.length > 0 ? (
        <motion.div
          className="space-y-4 my-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {atarVariants.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-0.5 font-body text-[9px] uppercase tracking-wider rounded"
                  style={{ backgroundColor: 'rgba(201,168,100,0.15)', color: '#C9A864' }}
                >
                  Atar
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                {atarVariants.map((v) => (
                  <VariantRow
                    key={v.id}
                    v={v}
                    dark={dark}
                    inputStyle={inputStyle}
                    stockValue={variantStockEdits[v.id] || ''}
                    onStockChange={(val) => setVariantStockEdits((prev) => ({ ...prev, [v.id]: val }))}
                    onUpdate={() => onUpdateStock(v.id)}
                    saving={saving}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {sprayVariants.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-0.5 font-body text-[9px] uppercase tracking-wider rounded"
                  style={{ backgroundColor: 'rgba(92,138,110,0.15)', color: '#5C8A6E' }}
                >
                  Spray
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                {sprayVariants.map((v) => (
                  <VariantRow
                    key={v.id}
                    v={v}
                    dark={dark}
                    inputStyle={inputStyle}
                    stockValue={variantStockEdits[v.id] || ''}
                    onStockChange={(val) => setVariantStockEdits((prev) => ({ ...prev, [v.id]: val }))}
                    onUpdate={() => onUpdateStock(v.id)}
                    saving={saving}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-2 py-8 my-5 font-body text-xs"
          style={{ color: dark ? 'rgba(237,231,218,0.3)' : 'rgba(26,38,32,0.3)' }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PackageOpen size={24} strokeWidth={1} />
          </motion.div>
          No variants yet
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end mt-5"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="px-4 py-2 font-heading text-[11px] tracking-[0.15em] uppercase transition-colors duration-200"
          style={{
            border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
            color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)',
          }}
        >
          Done
        </motion.button>
      </motion.div>
    </div>
  );
}

function VariantRow({ v, dark, inputStyle, stockValue, onStockChange, onUpdate, saving }) {
  const stockChanged = String(stockValue) !== String(v.stock);

  return (
    <motion.div
      variants={variantItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center justify-between px-3 py-2.5"
      style={{
        backgroundColor: dark ? '#0D1410' : '#F0EAD8',
        border: `1px solid ${dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)'}`,
      }}
    >
      <div className="flex items-center gap-4">
        <span className="font-heading text-xs tracking-wide" style={{ color: '#C9A864' }}>
          {v.volume_ml}ml
        </span>
        <span className="font-body text-xs" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
          ৳{Number(v.price).toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <input
            type="number"
            value={stockValue}
            onChange={(e) => onStockChange(e.target.value)}
            className="w-full px-2 py-1.5 font-body text-xs outline-none transition-all duration-200"
            style={inputStyle}
            min="0"
            placeholder="Stock"
          />
        </div>
        {stockChanged && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onUpdate}
            disabled={saving}
            className="w-7 h-7 flex items-center justify-center transition-colors duration-200"
            style={{ color: '#5C8A6E' }}
          >
            <Check size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
