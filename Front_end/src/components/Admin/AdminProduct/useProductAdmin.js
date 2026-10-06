
import { useState, useEffect } from 'react';
import {
  Get_products,
  Get_product_by_id,
  Add_product,
  Update_product,
  Delete_product,
  Add_variant,
  Update_variant,
  Delete_variant,
} from '../../Server/product';
import { Upload_image } from '../../Server/product_image';

const PERFUME_TYPES = ['floral', 'fresh', 'amber', 'woody', 'gourmand', 'citrusy'];
const PERFUME_FOR = ['Male', 'Female'];
const ATAR_VOLUMES = [3, 6, 12];
const SPRAY_VOLUMES = [12, 15, 30, 50, 100];

const makeEmptyAtar = () => ATAR_VOLUMES.map((v) => ({ volume_ml: v, price: '', stock: '0' }));
const makeEmptySpray = () => SPRAY_VOLUMES.map((v) => ({ volume_ml: v, price: '', stock: '0' }));

const emptyProduct = {
  name: '',
  description: '',
  perfume_type: '',
  perfume_for: '',
  atarVariants: makeEmptyAtar(),
  sprayVariants: makeEmptySpray(),
};

export function useProductAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [variants, setVariants] = useState([]);
  const [variantStockEdits, setVariantStockEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await Get_products();
      if (res.success) setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setForm({ ...emptyProduct, atarVariants: makeEmptyAtar(), sprayVariants: makeEmptySpray() });
    setSelected(null);
    setImageFile(null);
    setModal('add');
  }

  async function openEdit(product) {
    setSelected(product);
    try {
      const res = await Get_product_by_id(product.id);
      if (res.success) {
        const atar = makeEmptyAtar();
        const spray = makeEmptySpray();

        for (const v of (res.data.variants || [])) {
          if (v.packaging_type === 'atar') {
            const row = atar.find((r) => r.volume_ml === v.volume_ml);
            if (row) {
              row.id = v.id;
              row.price = String(v.price);
              row.stock = String(v.stock);
            }
          } else if (v.packaging_type === 'spray') {
            const row = spray.find((r) => r.volume_ml === v.volume_ml);
            if (row) {
              row.id = v.id;
              row.price = String(v.price);
              row.stock = String(v.stock);
            }
          }
        }

        setForm({
          name: res.data.name,
          description: res.data.description || '',
          perfume_type: res.data.perfume_type || '',
          perfume_for: res.data.perfume_for || '',
          atarVariants: atar,
          sprayVariants: spray,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setModal('edit');
  }

  function openDelete(product) {
    setSelected(product);
    setModal('delete');
  }

  async function openVariants(product) {
    setSelected(product);
    try {
      const res = await Get_product_by_id(product.id);
      if (res.success) {
        setVariants(res.data.variants || []);
        const stockMap = {};
        for (const v of (res.data.variants || [])) {
          stockMap[v.id] = String(v.stock);
        }
        setVariantStockEdits(stockMap);
      }
    } catch (err) {
      console.error(err);
    }
    setModal('variants');
  }

  function closeModal() {
    setModal(null);
    setImageFile(null);
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateVariantField(type, index, field, value) {
    setForm((prev) => {
      const key = type === 'atar' ? 'atarVariants' : 'sprayVariants';
      const updated = [...prev[key]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [key]: updated };
    });
  }

  async function handleAdd() {
    if (!form.name.trim()) return showToast('Product name is required', 'error');
    setSaving(true);
    try {
      const productPayload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        perfume_type: form.perfume_type || null,
        perfume_for: form.perfume_for || null,
      };
      const res = await Add_product(productPayload);
      if (res.success) {
        if (imageFile) {
          const fd = new FormData();
          fd.append('image', imageFile);
          fd.append('is_primary', 'true');
          await Upload_image(res.data.id, fd);
        }

        const allVariants = [
          ...form.atarVariants.map((v) => ({ ...v, packaging_type: 'atar' })),
          ...form.sprayVariants.map((v) => ({ ...v, packaging_type: 'spray' })),
        ];
        for (const v of allVariants) {
          if (v.price && v.price !== '') {
            await Add_variant(res.data.id, {
              packaging_type: v.packaging_type,
              volume_ml: v.volume_ml,
              price: Number(v.price),
              stock: Number(v.stock) || 0,
            });
          }
        }

        showToast('Product added successfully');
        setModal(null);
        setImageFile(null);
        fetchProducts();
      } else {
        showToast(res.message || 'Failed to add product', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!form.name.trim()) return showToast('Product name is required', 'error');
    setSaving(true);
    try {
      const productPayload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        perfume_type: form.perfume_type || null,
        perfume_for: form.perfume_for || null,
      };
      const res = await Update_product(selected.id, productPayload);
      if (res.success) {
        const currentVariants = [
          ...form.atarVariants.map((v) => ({ ...v, packaging_type: 'atar' })),
          ...form.sprayVariants.map((v) => ({ ...v, packaging_type: 'spray' })),
        ];
        const currentIds = currentVariants.filter((v) => v.id).map((v) => v.id);
        const allVariants = await Get_product_by_id(selected.id);

        if (allVariants.success) {
          for (const old of allVariants.data.variants) {
            if (!currentIds.includes(old.id)) {
              await Delete_variant(old.id);
            }
          }
        }

        for (const v of currentVariants) {
          if (v.price && v.price !== '') {
            if (v.id) {
              await Update_variant(v.id, {
                packaging_type: v.packaging_type,
                volume_ml: v.volume_ml,
                price: Number(v.price),
                stock: Number(v.stock) || 0,
              });
            } else {
              await Add_variant(selected.id, {
                packaging_type: v.packaging_type,
                volume_ml: v.volume_ml,
                price: Number(v.price),
                stock: Number(v.stock) || 0,
              });
            }
          }
        }

        showToast('Product updated successfully');
        setModal(null);
        fetchProducts();
      } else {
        showToast(res.message || 'Failed to update product', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      const res = await Delete_product(selected.id);
      if (res.success) {
        showToast('Product deleted');
        setModal(null);
        fetchProducts();
      } else {
        showToast(res.message || 'Failed to delete', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateVariantStock(variantId) {
    const stockVal = variantStockEdits[variantId];
    if (stockVal === undefined || stockVal === '') return;
    setSaving(true);
    try {
      const res = await Update_variant(variantId, { stock: Number(stockVal) });
      if (res.success) {
        showToast('Stock updated');
        const refreshed = await Get_product_by_id(selected.id);
        if (refreshed.success) setVariants(refreshed.data.variants || []);
        fetchProducts();
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.perfume_type?.toLowerCase().includes(search.toLowerCase()) ||
      p.perfume_for?.toLowerCase().includes(search.toLowerCase()) ||
      p.available_categories?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products.length,
    totalStock: products.reduce((sum, p) => sum + (Number(p.total_stock) || 0), 0),
    outOfStock: products.filter((p) => Number(p.total_stock) === 0).length,
  };

  return {
    products,
    filtered,
    loading,
    search,
    setSearch,
    stats,
    PERFUME_TYPES,
    PERFUME_FOR,
    ATAR_VOLUMES,
    SPRAY_VOLUMES,
    modal,
    selected,
    form,
    variants,
    variantStockEdits,
    setVariantStockEdits,
    saving,
    toast,
    imageFile,
    setImageFile,
    openAdd,
    openEdit,
    openDelete,
    openVariants,
    closeModal,
    updateForm,
    updateVariantField,
    handleAdd,
    handleEdit,
    handleDelete,
    handleUpdateVariantStock,
  };
}
