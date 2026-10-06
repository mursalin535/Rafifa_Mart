import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductToast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-24 right-6 z-[100] flex items-center gap-2.5 px-5 py-3 font-body text-sm shadow-xl"
          style={{
            backgroundColor: toast.type === 'error' ? '#3A1414' : '#0F1C15',
            border: `1px solid ${toast.type === 'error' ? '#8B3A3A' : '#1C4D3A'}`,
            color: '#F0EAD8',
            boxShadow: toast.type === 'error'
              ? '0 8px 30px rgba(181,80,79,0.2)'
              : '0 8px 30px rgba(201,168,100,0.15)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 15, 0] }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={16} style={{ color: '#E08A8A' }} />
            ) : (
              <CheckCircle2 size={16} style={{ color: '#C9A864' }} />
            )}
          </motion.div>
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
