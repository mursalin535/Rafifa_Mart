import { motion } from 'framer-motion';
import { Layers, Pencil, Trash2 } from 'lucide-react';
import IconButton from './ui/IconButton';

export default function ProductTableRow({ product: p, dark, onVariants, onEdit, onDelete }) {
  const initial = p.name?.charAt(0)?.toUpperCase() || '?';
  const outOfStock = Number(p.total_stock) === 0;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ borderBottom: `1px solid ${dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)'}` }}
      className="group transition-colors"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = dark ? 'rgba(28,77,58,0.1)' : 'rgba(201,185,154,0.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center font-heading text-xs shrink-0"
            style={{ backgroundColor: 'rgba(201,168,100,0.14)', color: '#C9A864' }}
          >
            {initial}
          </div>
          <span className="font-heading text-xs tracking-wide">{p.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="px-2 py-0.5 font-body text-[10px] uppercase tracking-wider"
          style={{
            backgroundColor: dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)',
            color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)',
          }}
        >
          {p.perfume_type || '—'}
        </span>
      </td>
      <td className="px-4 py-3 font-body text-xs">{p.perfume_for || '—'}</td>
      <td className="px-4 py-3 font-body text-xs">{p.available_categories || '—'}</td>
      <td className="px-4 py-3 font-body text-xs" style={{ color: '#C9A864' }}>
        {p.min_price != null && p.max_price != null
          ? p.min_price === p.max_price
            ? `৳${Number(p.min_price).toFixed(2)}`
            : `৳${Number(p.min_price).toFixed(2)} – ৳${Number(p.max_price).toFixed(2)}`
          : '—'}
      </td>
      <td className="px-4 py-3 font-body text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: outOfStock ? '#B5504F' : '#5C8A6E' }}
          />
          <span style={{ color: outOfStock ? '#B5504F' : 'inherit' }}>{p.total_stock ?? 0}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <IconButton icon={Layers} label="Manage variants" tone="gold" dark={dark} onClick={() => onVariants(p)} />
          <IconButton icon={Pencil} label="Edit product" tone="neutral" dark={dark} onClick={() => onEdit(p)} />
          <IconButton icon={Trash2} label="Delete product" tone="danger" dark={dark} onClick={() => onDelete(p)} />
        </div>
      </td>
    </motion.tr>
  );
}