import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer style={{ backgroundColor: dark ? '#0A0A0A' : '#FAF7F0', borderTop: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Seal */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ border: '1.5px solid #C9A864' }}
          >
            <span className="font-heading text-xl font-medium" style={{ color: '#C9A864' }}>R</span>
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-wide" style={{ color: dark ? '#F5F1E6' : '#1A2620' }}>
            Rafifa Mart
          </h2>
          <p className="font-body text-[12px] mt-1" style={{ color: '#C9A864' }}>
            Heritage Perfumery Since 1897
          </p>
        </div>

        <div className="brass-hairline max-w-lg mx-auto mb-8" />

        {/* Links */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {[
            { title: 'Collection', items: ['All Fragrances', 'Oud Collection', 'Floral', 'Woody', 'Citrus'] },
            { title: 'Heritage', items: ['Our Story', 'Craftsmanship', 'Ingredients', 'Atelier'] },
            { title: 'Service', items: ['Contact', 'Shipping', 'Returns', 'Gift Wrapping'] },
            { title: 'Follow', items: ['Instagram', 'Pinterest', 'Twitter'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-body text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: '#C9A864' }}>
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item}>
                    <Link to="/products" className="font-body text-[12px] transition-colors duration-200" style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="brass-hairline max-w-lg mx-auto mb-6" />

        <p className="text-center font-body text-[10px] tracking-wider" style={{ color: dark ? 'rgba(237,231,218,0.3)' : 'rgba(26,38,32,0.3)' }}>
          &copy; 2026 Rafifa Mart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
