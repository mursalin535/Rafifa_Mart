import { motion } from 'framer-motion';
import { Search, Plus, Sparkles } from 'lucide-react';

export default function ProductHeader({ search, setSearch, onAdd, count, dark, inputStyle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
    >
      {/* Left - Title */}
      <div>
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
            <Sparkles size={20} strokeWidth={1.5} style={{ color: '#C9A864' }} />
          </motion.div>
          <h1
            className="font-heading text-2xl sm:text-3xl tracking-[0.12em] uppercase"
            style={{ color: '#C9A864' }}
          >
            Products
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs mt-1.5 ml-8"
          style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}
        >
          {count} total products in inventory
        </motion.p>
      </div>

      {/* Right - Search + Add */}
      <motion.div
        className="flex items-center gap-3 w-full md:w-auto"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Search */}
        <motion.div
          className="relative flex-1 md:flex-none group rounded-2xl"
          whileFocus={{ scale: 1.02 }}
        >
      
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 font-body text-xs w-full md:w-56 outline-none transition-all duration-300 focus:ring-1 rounded-2xl"
            style={{
              ...inputStyle,
              focusRingColor: '#C9A864',
            }}
          />
        </motion.div>

        {/* Add Button */}
        <motion.button
          
          whileTap={{ scale: 0.96 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 font-heading text-[13px] tracking-[0.15em] uppercase shrink-0 transition-shadow duration-300 rounded-4xl"
          style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={14} strokeWidth={2.5} />
          </motion.div>
          New Product
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
