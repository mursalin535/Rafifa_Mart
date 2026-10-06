import { motion } from 'framer-motion';
import { X, Plus, ImagePlus, ChevronDown } from 'lucide-react';
import FormField from './FormField';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function VariantSection({ label, tag, volumes, data, updateVariantField, dark, inputStyle, type }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="px-2 py-0.5 font-heading text-[10px] tracking-[0.15em] uppercase"
          style={{
            backgroundColor: type === 'atar' ? 'rgba(201,168,100,0.12)' : 'rgba(28,77,58,0.15)',
            color: '#C9A864',
          }}
        >
          {label}
        </span>
      </div>

      <div className="space-y-2.5">
        {data.map((row, i) => {
          const hasPrice = row.price && row.price !== '';
          return (
            <motion.div
              key={row.volume_ml}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3"
              style={{ opacity: hasPrice ? 1 : 0.5 }}
            >
              <span
                className="w-16 text-right font-heading text-[11px] tracking-wider shrink-0"
                style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}
              >
                {row.volume_ml}ml
              </span>
              <input
                type="number"
                placeholder="Price ৳"
                value={row.price}
                onChange={(e) => updateVariantField(type, i, 'price', e.target.value)}
                className="flex-1 px-3 py-2.5 font-body text-xs outline-none transition-all duration-200 focus:ring-1"
                style={inputStyle}
                min="0"
              />
              <input
                type="number"
                placeholder="Stock"
                value={row.stock}
                onChange={(e) => updateVariantField(type, i, 'stock', e.target.value)}
                className="w-20 px-3 py-2.5 font-body text-xs outline-none transition-all duration-200 focus:ring-1"
                style={inputStyle}
                min="0"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductFormModal({
  mode,
  form,
  dark,
  saving,
  inputStyle,
  PERFUME_TYPES,
  PERFUME_FOR,
  updateForm,
  updateVariantField,
  imageFile,
  setImageFile,
  onCancel,
  onSubmit,
}) {
  return (
    <div className="flex flex-col max-h-[85vh]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-6 py-6 shrink-0"
        style={{ borderBottom: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,168,100,0.12)', color: '#C9A864' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {mode === 'add' ? <Plus size={14} strokeWidth={2} /> : <ChevronDown size={14} strokeWidth={2} />}
          </motion.div>
          <h2 className="font-heading text-lg tracking-[0.1em] uppercase" style={{ color: '#C9A864' }}>
            {mode === 'add' ? 'New Product' : 'Edit Product'}
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center transition-colors"
          style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}
        >
          <X size={18} />
        </motion.button>
      </motion.div>

      {/* Scrollable body */}
      <div className="px-6 py-7 overflow-y-auto space-y-7">
        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
          <FormField label="Name" required dark={dark}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              className="w-full px-3 py-2.5 font-body text-xs outline-none transition-all duration-200 focus:ring-1"
              style={inputStyle}
              placeholder="e.g. Velvet Oud"
            />
          </FormField>
        </motion.div>

        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
          <FormField label="Description" dark={dark}>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 font-body text-xs outline-none resize-none transition-all duration-200 focus:ring-1"
              style={inputStyle}
              placeholder="Product description..."
            />
          </FormField>
        </motion.div>

        {mode === 'add' && (
          <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
            <FormField label="Product Image" dark={dark}>
              <motion.label
                whileHover={{ borderColor: '#C9A864' }}
                className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: dark ? 'rgba(28,77,58,0.08)' : 'rgba(201,185,154,0.08)',
                  border: `1px dashed ${dark ? '#1C4D3A' : '#C9B99A'}`,
                }}
              >
                {imageFile ? (
                  <div className="flex items-center gap-3">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-12 h-12 object-cover"
                      style={{ border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}
                    />
                    <div className="text-left">
                      <p className="font-body text-xs" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
                        {imageFile.name}
                      </p>
                      <p className="font-body text-[10px]" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                        {(imageFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.preventDefault(); setImageFile(null); }}
                      className="ml-2"
                      style={{ color: '#B5504F' }}
                    >
                      <X size={14} />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ImagePlus size={22} style={{ color: '#C9A864' }} />
                    </motion.div>
                    <span className="font-body text-[10px] uppercase tracking-wider" style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
                      Click to upload image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                />
              </motion.label>
            </FormField>
          </motion.div>
        )}

        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Type" dark={dark}>
              <select
                value={form.perfume_type}
                onChange={(e) => updateForm('perfume_type', e.target.value)}
                className="w-full px-3 py-2.5 font-body text-xs outline-none appearance-none transition-all duration-200"
                style={inputStyle}
              >
                <option value="">Select</option>
                {PERFUME_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FormField>
            <FormField label="For" dark={dark}>
              <select
                value={form.perfume_for}
                onChange={(e) => updateForm('perfume_for', e.target.value)}
                className="w-full px-3 py-2.5 font-body text-xs outline-none appearance-none transition-all duration-200"
                style={inputStyle}
              >
                <option value="">Select</option>
                {PERFUME_FOR.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </FormField>
          </div>
        </motion.div>

        {/* Variant pricing sections */}
        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
          <div
            className="px-5 py-5 space-y-6"
            style={{
              backgroundColor: dark ? 'rgba(28,77,58,0.06)' : 'rgba(201,185,154,0.06)',
              border: `1px solid ${dark ? 'rgba(28,77,58,0.2)' : 'rgba(201,185,154,0.2)'}`,
            }}
          >
            <div className="flex items-center justify-between">
              <label
                className="font-heading text-[10px] tracking-[0.2em] uppercase"
                style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}
              >
                Set Prices (leave blank to skip)
              </label>
            </div>

            <VariantSection
              label="Atar"
              type="atar"
              data={form.atarVariants}
              updateVariantField={updateVariantField}
              dark={dark}
              inputStyle={inputStyle}
            />

            <div
              className="w-full h-px"
              style={{ backgroundColor: dark ? 'rgba(28,77,58,0.2)' : 'rgba(201,185,154,0.2)' }}
            />

            <VariantSection
              label="Spray"
              type="spray"
              data={form.sprayVariants}
              updateVariantField={updateVariantField}
              dark={dark}
              inputStyle={inputStyle}
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end gap-3 px-6 py-5 shrink-0"
        style={{ borderTop: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}
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
          whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(201,168,100,0.25)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          disabled={saving}
          className="px-5 py-2 font-heading text-[11px] tracking-[0.15em] uppercase disabled:opacity-50 transition-shadow duration-300"
          style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
        >
          {saving ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Save Changes'}
        </motion.button>
      </motion.div>
    </div>
  );
}
