import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Pencil, Trash2, PackageX } from 'lucide-react';

const API_BASE = 'http://localhost:5007';

export default function ProductCard({ product: p, dark, onVariants, onEdit, onDelete, index }) {
  const [imgError, setImgError] = useState(false);
  const outOfStock = Number(p.total_stock) === 0;
  const primaryImage = p.image_url || null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group relative flex flex-col cursor-pointer rounded-md p-[2px] overflow-hidden"
    >
      {/* Animated gradient border — always rotating, glows a little stronger on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[40%]"
        style={{
          background:
            'conic-gradient(from 0deg, #C9A864, #5C8A6E 25%, #C9A864 50%, #5C1A1A 75%, #C9A864 100%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Soft glow layer, brightens on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md opacity-40 group-hover:opacity-80 transition-opacity duration-500"
        style={{ boxShadow: '0 0 24px 2px rgba(201,168,100,0.35)' }}
      />

      {/* Inner card body — inset so only a crisp ring of the animated border shows */}
      <div
        className="relative flex flex-col flex-1 overflow-hidden rounded-[5px]"
        style={{ backgroundColor: dark ? '#0D1410' : '#FAF7F0' }}
      >
        {/* Image Section — larger with gradient overlay */}
        <div
          className="relative h-40 sm:h-44 lg:h-52 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: dark ? '#0A120D' : '#F0EAD8' }}
        >
          {primaryImage && !imgError ? (
            <motion.img
              src={`${API_BASE}${primaryImage}`}
              alt={p.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onError={() => setImgError(true)}
            />
          ) : (
            <motion.div
              className="w-14 h-14 flex items-center justify-center font-heading text-xl"
              style={{ backgroundColor: 'rgba(201,168,100,0.12)', color: '#C9A864' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {p.name?.charAt(0)?.toUpperCase() || '?'}
            </motion.div>
          )}

          {/* Out of stock badge */}
          {outOfStock && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 font-body text-[9px] uppercase tracking-wider"
              style={{ backgroundColor: 'rgba(92,26,26,0.85)', color: '#F0EAD8', backdropFilter: 'blur(4px)' }}
            >
              <PackageX size={10} />
              Out of Stock
            </motion.div>
          )}

          {/* Hover gradient overlay with actions */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-sm text-[8px] sm:text-[10px] uppercase tracking-wider font-body"
                style={{ backgroundColor: 'rgba(201,168,100,0.25)', color: '#C9A864', border: '1px solid rgba(201,168,100,0.3)', backdropFilter: 'blur(4px)' }}
                onClick={(e) => { e.stopPropagation(); onVariants(p); }}
              >
                <Layers size={10} /> Variants
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-sm text-[8px] sm:text-[10px] uppercase tracking-wider font-body"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#F0EAD8', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
                onClick={(e) => { e.stopPropagation(); onEdit(p); }}
              >
                <Pencil size={10} /> Edit
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-sm text-[8px] sm:text-[10px] uppercase tracking-wider font-body"
                style={{ backgroundColor: 'rgba(138,58,58,0.3)', color: '#F0EAD8', border: '1px solid rgba(138,58,58,0.4)', backdropFilter: 'blur(4px)' }}
                onClick={(e) => { e.stopPropagation(); onDelete(p); }}
              >
                <Trash2 size={10} /> Delete
              </motion.button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 flex-1">
          {/* Name + Type row */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <h3
              className="font-heading text-[13px] sm:text-sm tracking-wide leading-tight line-clamp-1"
              style={{ color: dark ? '#F0EAD8' : '#1A2620' }}
            >
              {p.name}
            </h3>
            {p.perfume_type && (
              <span
                className="shrink-0 px-2 py-0.5 font-body text-[9px] uppercase tracking-wider"
                style={{
                  backgroundColor: dark ? 'rgba(28,77,58,0.25)' : 'rgba(201,185,154,0.3)',
                  color: '#C9A864',
                }}
              >
                {p.perfume_type}
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap -mt-2">
            {p.perfume_for && (
              <span
                className="font-body text-[10px] tracking-wider"
                style={{ color: dark ? 'rgba(237,231,218,0.45)' : 'rgba(26,38,32,0.45)' }}
              >
                {p.perfume_for}
              </span>
            )}
            {p.perfume_for && p.available_categories && (
              <span style={{ color: dark ? 'rgba(237,231,218,0.2)' : 'rgba(26,38,32,0.2)' }}>·</span>
            )}
            {p.available_categories && (
              <span
                className="font-body text-[10px] tracking-wider"
                style={{ color: dark ? 'rgba(237,231,218,0.45)' : 'rgba(26,38,32,0.45)' }}
              >
                {p.available_categories}
              </span>
            )}
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ backgroundColor: dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)' }}
          />

          {/* Price + Stock row */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <p
                className="font-body text-[8px] sm:text-[9px] uppercase tracking-wider mb-1 sm:mb-1.5"
                style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}
              >
                Price
              </p>
              <p className="font-heading text-[13px] sm:text-sm lg:text-base" style={{ color: '#C9A864' }}>
                {p.min_price != null && p.max_price != null
                  ? p.min_price === p.max_price
                    ? `৳${Number(p.min_price).toFixed(0)}`
                    : `৳${Number(p.min_price).toFixed(0)} – ৳${Number(p.max_price).toFixed(0)}`
                  : '—'}
              </p>
            </div>
            <div className="text-right">
              <p
                className="font-body text-[8px] sm:text-[9px] uppercase tracking-wider mb-1 sm:mb-1.5"
                style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}
              >
                Stock
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: outOfStock ? '#B5504F' : '#5C8A6E' }}
                />
                <span
                  className="font-heading text-[13px] sm:text-sm lg:text-base"
                  style={{ color: outOfStock ? '#B5504F' : dark ? '#F0EAD8' : '#1A2620' }}
                >
                  {p.total_stock ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}