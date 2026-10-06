import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gem, Users, Package, Shield, Wine, Tag } from 'lucide-react';

const tabs = [
  { key: 'products', label: 'Products', icon: Gem },
  { key: 'bottles', label: 'Bottles', icon: Wine },
  { key: 'offers', label: 'Offers', icon: Tag },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'admins', label: 'Admins', icon: Shield },
];

export default function AdminNav({ selectNavElement, horizontal = false }) {
  const [active, setActive] = useState('products');

  function handleClick(key) {
    setActive(key);
    selectNavElement(key);
  }

  // Mobile: horizontal scrollable bar at top
  if (horizontal) {
    return (
      <div
        className="w-full overflow-x-auto flex items-center gap-1 py-3 px-4"
        style={{
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid rgba(201,168,100,0.15)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              onClick={() => handleClick(tab.key)}
              className="relative flex items-center gap-1.5 px-3 py-2 shrink-0 font-heading text-[9px] sm:text-[10px] tracking-[0.1em] uppercase rounded-sm overflow-hidden"
              style={{ color: isActive ? '#0A0A0A' : 'rgba(237,231,218,0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-active-bg-mobile"
                  className="absolute inset-0"
                  style={{ backgroundColor: '#C9A864' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                size={12}
                strokeWidth={1.5}
                className="relative z-10 shrink-0"
                style={{ color: isActive ? '#0A0A0A' : '#C9A864' }}
              />
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Desktop: vertical sidebar
  return (
    <div
      className="w-full flex flex-col gap-1 py-6 pr-4 lg:pr-6 sticky top-0 h-full"
      style={{ borderRight: '1px solid rgba(201,168,100,0.15)' }}
    >
      <p
        className="font-heading text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-4 pl-4"
        style={{ color: 'rgba(237,231,218,0.35)' }}
      >
        Admin Panel
      </p>

      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            className="relative flex items-center gap-3 py-3 pl-4 pr-4 lg:pr-6 font-heading text-[11px] sm:text-[12px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-left rounded-r-sm overflow-hidden"
            style={{ color: isActive ? '#0A0A0A' : 'rgba(237,231,218,0.55)' }}
            whileHover={!isActive ? { color: '#C9A864' } : {}}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.span
                layoutId="admin-active-bg"
                className="absolute inset-0"
                style={{ backgroundColor: '#C9A864' }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}

            <Icon
              size={14}
              strokeWidth={1.5}
              className="relative z-10 shrink-0"
              style={{ color: isActive ? '#0A0A0A' : '#C9A864' }}
            />
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
