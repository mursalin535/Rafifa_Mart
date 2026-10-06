import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ loading, filtered, dark, onVariants, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={28} style={{ color: '#C9A864' }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs"
          style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}
        >
          Loading products...
        </motion.p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-24 gap-4"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PackageSearch size={40} strokeWidth={1} style={{ color: dark ? 'rgba(237,231,218,0.15)' : 'rgba(26,38,32,0.15)' }} />
        </motion.div>
        <p
          className="font-heading text-sm tracking-[0.1em]"
          style={{ color: dark ? 'rgba(237,231,218,0.3)' : 'rgba(26,38,32,0.3)' }}
        >
          No products found
        </p>
        <p
          className="font-body text-[10px] tracking-wider"
          style={{ color: dark ? 'rgba(237,231,218,0.2)' : 'rgba(26,38,32,0.2)' }}
        >
          Try adjusting your search or add a new product
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filtered.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            dark={dark}
            onVariants={onVariants}
            onEdit={onEdit}
            onDelete={onDelete}
            index={i}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}