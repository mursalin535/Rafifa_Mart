import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminNav from './AdminNav';
import AdminProduct from './AdminProduct/AdminProduct';
import AdminBottle from './AdminBottle';
import AdminOffer from './AdminOffer';
import AdminCustomer from './AdminCustomer';
import AdminOrder from './AdminOrder';
import AdminManagement from './AdminManagement';

export default function Admin() {
  const [navElement, setNavElement] = useState('products');

  function selectNavElement(element) {
    setNavElement(element);
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>

      {/* Spacer for fixed navbar */}
      <div className="w-full h-20 lg:hidden" />

      {/* Mobile: Nav at top as horizontal scroll */}
      <div className="lg:hidden sticky top-20 z-40" style={{ backgroundColor: '#0A0A0A' }}>
        <AdminNav selectNavElement={selectNavElement} horizontal />
      </div>

      {/* Mobile: Spacer between admin nav and content */}
      <div className="w-full h-6 lg:hidden" />

      {/* Desktop: Sidebar + Content */}
      <div className="hidden lg:flex w-full">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen w-[22%] shrink-0" style={{ backgroundColor: '#0A0A0A' }}>
          <AdminNav selectNavElement={selectNavElement} horizontal={false} />
        </div>

        {/* Content */}
        <div className="w-[78%] min-h-screen">
          <motion.div className="w-full h-[10vh] lg:h-[12vh]" />
          {navElement === 'products' && <AdminProduct />}
          {navElement === 'bottles' && <AdminBottle />}
          {navElement === 'offers' && <AdminOffer />}
          {navElement === 'customers' && <AdminCustomer />}
          {navElement === 'orders' && <AdminOrder />}
          {navElement === 'admins' && <AdminManagement />}
        </div>
      </div>

      {/* Mobile: Content */}
      <div className="lg:hidden w-full">
        {navElement === 'products' && <AdminProduct />}
        {navElement === 'bottles' && <AdminBottle />}
        {navElement === 'offers' && <AdminOffer />}
        {navElement === 'customers' && <AdminCustomer />}
        {navElement === 'orders' && <AdminOrder />}
        {navElement === 'admins' && <AdminManagement />}
      </div>

    </div>
  );
}
