import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const API_BASE = 'http://localhost:5007';

export default function ProductCard({ product, onView }) {
  const [imgError, setImgError] = useState(false);
  const { dark } = useTheme();

  return (
    <div
      className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
      style={{ backgroundColor: dark ? '#13201A' : '#F0EAD8' }}
      onClick={() => onView?.(product)}
    >
      {/* Image area */}
      <div
        className="h-48 flex items-center justify-center"
        style={{ borderBottom: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}
      >
        {product.image_url && !imgError ? (
          <img
            src={`${API_BASE}${product.image_url}`}
            alt={product.name}
            className="h-36 w-auto object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-14 h-20 flex items-center justify-center"
            style={{ border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}
          >
            <span className="font-heading text-xl" style={{ color: '#C9A864' }}>{product.name?.[0]}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 text-center">
        <h3 className="font-heading text-[15px] mb-1" style={{ color: dark ? '#F5F1E6' : '#1A2620' }}>
          {product.name}
        </h3>
        <p
          className="font-body text-[11px] uppercase tracking-[0.1em] mb-3"
          style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}
        >
          Eau de Parfum
        </p>
        <div className="brass-hairline mb-3" />
        <p className="font-heading text-[14px]" style={{ color: '#C9A864' }}>
          PKR {Number(product.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
