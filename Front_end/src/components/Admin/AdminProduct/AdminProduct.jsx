import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useProductAdmin } from './useProductAdmin';
import ProductToast from './ProductToast';
import ProductStatsBar from './ProductStatsBar';
import ProductHeader from './ProductHeader';
import ProductGrid from './ProductGrid';
import DeleteProductModal from './DeleteProductModal';
import ProductFormModal from './ProductFormModal';
import VariantsModal from './VariantsModal';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function AdminProduct() {
  const { dark } = useTheme();
  const admin = useProductAdmin();

  const inputStyle = {
    backgroundColor: dark ? '#0D1410' : '#F5F1E6',
    border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
    color: dark ? '#F0EAD8' : '#1A2620',
  };

  return (
    <div className="w-full px-4 md:px-8 py-6" style={{ color: dark ? '#F0EAD8' : '#1A2620' }}>
      <ProductToast toast={admin.toast} />

      <ProductHeader
        search={admin.search}
        setSearch={admin.setSearch}
        onAdd={admin.openAdd}
        count={admin.products.length}
        dark={dark}
        inputStyle={inputStyle}
      />

      <ProductStatsBar stats={admin.stats} dark={dark} />

      <ProductGrid
        loading={admin.loading}
        filtered={admin.filtered}
        dark={dark}
        onVariants={admin.openVariants}
        onEdit={admin.openEdit}
        onDelete={admin.openDelete}
      />

      <AnimatePresence>
        {admin.modal && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={admin.closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full overflow-hidden"
              style={{
                maxWidth: admin.modal === 'delete' ? '400px' : '560px',
                backgroundColor: dark ? '#0A0A0A' : '#FAF7F0',
                border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,100,0.06)',
              }}
            >
              {admin.modal === 'delete' && (
                <DeleteProductModal
                  selected={admin.selected}
                  saving={admin.saving}
                  dark={dark}
                  onCancel={admin.closeModal}
                  onConfirm={admin.handleDelete}
                />
              )}

              {(admin.modal === 'add' || admin.modal === 'edit') && (
                <ProductFormModal
                  mode={admin.modal}
                  form={admin.form}
                  dark={dark}
                  saving={admin.saving}
                  inputStyle={inputStyle}
                  PERFUME_TYPES={admin.PERFUME_TYPES}
                  PERFUME_FOR={admin.PERFUME_FOR}
                  updateForm={admin.updateForm}
                  updateVariantField={admin.updateVariantField}
                  imageFile={admin.imageFile}
                  setImageFile={admin.setImageFile}
                  onCancel={admin.closeModal}
                  onSubmit={admin.modal === 'add' ? admin.handleAdd : admin.handleEdit}
                />
              )}

              {admin.modal === 'variants' && (
                <VariantsModal
                  selected={admin.selected}
                  variants={admin.variants}
                  variantStockEdits={admin.variantStockEdits}
                  setVariantStockEdits={admin.setVariantStockEdits}
                  saving={admin.saving}
                  dark={dark}
                  inputStyle={inputStyle}
                  onUpdateStock={admin.handleUpdateVariantStock}
                  onClose={admin.closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
