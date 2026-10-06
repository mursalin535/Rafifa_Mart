import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Get_addresses, Add_address } from '../Server/address';
import { Add_order } from '../Server/order';

function VerticalOrnament({ flip = false }) {
  return (
    <motion.svg
      width="60"
      height="480"
      viewBox="0 0 60 480"
      className="opacity-80"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <g fill="none" stroke="#C9A864" strokeWidth="1.2">
        <motion.line
          x1="30" y1="0" x2="30" y2="170"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M30 170 C 10 175, 8 190, 20 198 C 32 206, 32 190, 30 185"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.path
          d="M30 170 C 50 175, 52 190, 40 198 C 28 206, 28 190, 30 185"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.circle
          cx="30" cy="240" r="6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', repeatDelay: 2.5, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.circle
          cx="30" cy="240" r="2"
          fill="#C9A864" stroke="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'loop', repeatDelay: 3.3, ease: 'easeInOut', delay: 1.1 }}
        />
        {[0, 90, 180, 270].map((deg, i) => (
          <motion.line
            key={deg}
            x1="30" y1="228" x2="30" y2="216"
            transform={`rotate(${deg} 30 240)`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: 'loop', repeatDelay: 3, ease: 'easeInOut', delay: 1 + i * 0.1 }}
          />
        ))}
        <motion.path
          d="M30 310 C 10 305, 8 290, 20 282 C 32 274, 32 290, 30 295"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.4 }}
        />
        <motion.path
          d="M30 310 C 50 305, 52 290, 40 282 C 28 274, 28 290, 30 295"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.9, ease: 'easeInOut', delay: 1.6 }}
        />
        <motion.line
          x1="30" y1="310" x2="30" y2="480"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1.5, ease: 'easeInOut', delay: 1.9 }}
        />
      </g>
    </motion.svg>
  );
}

export default function CheckOut() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const orderState = location.state;

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    recipient_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    district: '',
    division: '',
    postal_code: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    async function fetchAddresses() {
      if (!user) {
        setAddressesLoading(false);
        return;
      }
      try {
        const res = await Get_addresses(user.id);
        const addressList = Array.isArray(res) ? res : res?.data ?? [];
        setAddresses(addressList);

        const defaultAddr = addressList.find(a => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (addressList.length > 0) {
          setSelectedAddressId(addressList[0].id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      } finally {
        setAddressesLoading(false);
      }
    }
    fetchAddresses();
  }, [user]);

  if (!orderState) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/50 text-sm">
          No order information found. Please go back and select a product.
        </span>
      </div>
    );
  }

  const {
    product,
    order_items = [],
    variants_subtotal = 0,
    grand_total = 0,
  } = orderState;

  function handleNewAddressChange(field, value) {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  }

  async function handleSaveNewAddress() {
    if (!user) return;
    setSavingAddress(true);
    try {
      const payload = { ...newAddress, customer_id: user.id };
      const res = await Add_address(payload);
      const savedAddress = res?.data ?? res;
      setAddresses(prev => [...prev, savedAddress]);
      setSelectedAddressId(savedAddress.id);
      setShowNewAddressForm(false);
    } catch (err) {
      console.error('Failed to save address:', err);
    } finally {
      setSavingAddress(false);
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) return;
    setPlacingOrder(true);
    setOrderError(null);

    try {
      // order_items থেকে perfume items বানানো — backend নিজে DB থেকে unit_price
      // বের করে (Order_controller -> Product_model.Get_variant_by_id), তাই এখানে
      // শুধু variant_id আর quantity পাঠালেই যথেষ্ট
      const perfumeItems = order_items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      }));

      const payload = {
        customer_id: user.id,
        address_id: selectedAddressId,
        payment_method: 'cod',
        items: perfumeItems,
      };

      const res = await Add_order(payload);

      if (res?.success) {
       alert('Order Placement Successfull');
        navigate('/profile');
      } else {
        setOrderError(res?.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      setOrderError('Something went wrong while placing your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
        <span className="font-body text-[#F0EAD8]/40 text-sm">Checking your session...</span>
      </div>
    );
  }

  return (
    <>
      <motion.div className="w-full h-[7vh] bg-[#0a0f0c]" />

      <motion.div className="w-full min-h-[95vh] flex flex-row justify-center items-stretch relative overflow-hidden">

        {/* বাম প্যানেল — maroon */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#011863] left-0 flex justify-start items-center pr-4 lg:pr-10">
          <VerticalOrnament />
        </motion.div>

        {/* ডান প্যানেল — forest green */}
        <motion.div className="w-1/2 min-h-full absolute z-0 bg-[#13201A] right-0 flex justify-end items-center pl-4 lg:pl-10">
          <VerticalOrnament flip />
        </motion.div>

        {/* কেন্দ্রের মূল কার্ড — এখন অনেক চওড়া, দুই কলামের জন্য জায়গা রাখতে */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[94%] lg:w-[85%] xl:w-[75%] my-6 z-10 bg-[#0a0f0c] rounded-[2rem] border-2 border-[#C9A864]/40 overflow-hidden flex flex-col"
          style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="w-full overflow-y-auto custom-scrollbar px-6 sm:px-10 py-10 flex flex-col gap-8">

            {/* হেডার */}
            <div>
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 0.8 }}
                className="text-xs uppercase text-[#C9A864] font-body mb-3 block"
              >
                Checkout
              </motion.span>
              <h1
                className="font-heading text-3xl sm:text-4xl mb-3 bg-clip-text text-transparent bg-[length:200%_100%]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #F0EAD8 0%, #C9A864 25%, #F0EAD8 50%, #C9A864 75%, #F0EAD8 100%)',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                Review &amp; Confirm
              </h1>
              <svg width="120" height="16" viewBox="0 0 120 16" className="opacity-60">
                <line x1="0" y1="8" x2="45" y2="8" stroke="#C9A864" strokeWidth="1" />
                <circle cx="60" cy="8" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
                <line x1="75" y1="8" x2="120" y2="8" stroke="#C9A864" strokeWidth="1" />
              </svg>
            </div>

            {/* ============ দুই কলাম, পাশাপাশি — address আর order summary ============ */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* ============ কলাম ১ — ঠিকানা ============ */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A864] font-body flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#C9A864] rounded-full inline-block" />
                  Delivery Address
                </span>

                <div className="border border-[#C9A864]/15 bg-[#0d1410]/80 p-6 rounded-2xl relative overflow-hidden">
                  <svg className="absolute -top-1 -left-1 w-6 h-6 pointer-events-none opacity-70" viewBox="0 0 32 32">
                    <path d="M2 14 V2 H14" fill="none" stroke="#C9A864" strokeWidth="1.5" />
                  </svg>
                  <svg className="absolute -bottom-1 -right-1 w-6 h-6 pointer-events-none opacity-70" viewBox="0 0 32 32">
                    <path d="M18 30 H30 V18" fill="none" stroke="#C9A864" strokeWidth="1.5" />
                  </svg>

                  {addressesLoading ? (
                    <div className="flex items-center gap-2 py-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#C9A864]/20 border-t-[#C9A864] rounded-full"
                      />
                      <span className="font-body text-[#F0EAD8]/40 text-xs">Loading your addresses...</span>
                    </div>
                  ) : (
                    <>
                      {addresses.length > 0 && (
                        <div className="flex flex-col gap-3 mb-5">
                          <AnimatePresence>
                            {addresses.map((addr, i) => {
                              const active = selectedAddressId === addr.id;
                              return (
                                <motion.button
                                  key={addr.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: i * 0.08 }}
                                  whileHover={{ y: -2 }}
                                  onClick={() => setSelectedAddressId(addr.id)}
                                  className="text-left px-4 py-4 rounded-xl border relative overflow-hidden transition-colors"
                                  style={{
                                    borderColor: active ? '#C9A864' : 'rgba(240,234,216,0.1)',
                                    backgroundColor: active ? 'rgba(201,168,100,0.08)' : 'rgba(255,255,255,0.015)',
                                    boxShadow: active ? '0 0 20px rgba(201,168,100,0.15)' : 'none',
                                  }}
                                >
                                  {active && (
                                    <motion.div
                                      layoutId="address-glow"
                                      className="absolute inset-0 pointer-events-none"
                                      style={{
                                        background: 'radial-gradient(circle at 0% 0%, rgba(201,168,100,0.12), transparent 70%)',
                                      }}
                                    />
                                  )}
                                  <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                      <span className="font-heading text-[#F0EAD8] text-sm flex items-center gap-2">
                                        <motion.span
                                          animate={active ? { scale: [1, 1.3, 1] } : {}}
                                          transition={{ duration: 0.4 }}
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: active ? '#C9A864' : 'rgba(240,234,216,0.15)' }}
                                        />
                                        {addr.label}
                                      </span>
                                      {addr.is_default ? (
                                        <span className="text-[10px] uppercase tracking-wider text-[#C9A864] border border-[#C9A864]/40 px-2 py-0.5 rounded-sm">
                                          Default
                                        </span>
                                      ) : null}
                                    </div>
                                    <span className="font-body text-[#F0EAD8]/70 text-sm block mt-1.5 ml-4">
                                      {addr.recipient_name} · {addr.phone}
                                    </span>
                                    <span className="font-body text-[#F0EAD8]/40 text-xs block mt-1 ml-4">
                                      {addr.address_line1}
                                      {addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}
                                      {addr.district ? `, ${addr.district}` : ''}
                                      {addr.postal_code ? ` — ${addr.postal_code}` : ''}
                                    </span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}

                      {!showNewAddressForm ? (
                        <motion.button
                          whileHover={{ letterSpacing: '0.1em', borderColor: '#C9A864' }}
                          onClick={() => setShowNewAddressForm(true)}
                          className="text-xs uppercase tracking-wider text-[#C9A864] border border-[#C9A864]/40 px-4 py-2.5 rounded-xl w-full"
                        >
                          + Add New Address
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.4 }}
                          className="flex flex-col gap-3 mt-2 pt-5 border-t border-[#C9A864]/10 overflow-hidden"
                        >
                          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A864] font-body mb-1 block">
                            New Address
                          </span>
                          {[
                            { key: 'label', placeholder: 'Label (Home, Office...)' },
                            { key: 'recipient_name', placeholder: 'Recipient Name' },
                            { key: 'phone', placeholder: 'Phone' },
                            { key: 'address_line1', placeholder: 'Address Line 1' },
                            { key: 'address_line2', placeholder: 'Address Line 2 (optional)' },
                          ].map(({ key, placeholder }) => (
                            <input
                              key={key}
                              placeholder={placeholder}
                              value={newAddress[key]}
                              onChange={(e) => handleNewAddressChange(key, e.target.value)}
                              className="bg-[#0a0f0c] border border-[#F0EAD8]/10 px-3 py-2.5 text-sm text-[#F0EAD8] font-body rounded-lg focus:border-[#C9A864]/50 outline-none transition-colors"
                            />
                          ))}
                          <div className="flex gap-3">
                            <input
                              placeholder="City"
                              value={newAddress.city}
                              onChange={(e) => handleNewAddressChange('city', e.target.value)}
                              className="flex-1 bg-[#0a0f0c] border border-[#F0EAD8]/10 px-3 py-2.5 text-sm text-[#F0EAD8] font-body rounded-lg focus:border-[#C9A864]/50 outline-none transition-colors"
                            />
                            <input
                              placeholder="Postal Code"
                              value={newAddress.postal_code}
                              onChange={(e) => handleNewAddressChange('postal_code', e.target.value)}
                              className="flex-1 bg-[#0a0f0c] border border-[#F0EAD8]/10 px-3 py-2.5 text-sm text-[#F0EAD8] font-body rounded-lg focus:border-[#C9A864]/50 outline-none transition-colors"
                            />
                          </div>
                          <div className="flex gap-3">
                            <input
                              placeholder="District"
                              value={newAddress.district}
                              onChange={(e) => handleNewAddressChange('district', e.target.value)}
                              className="flex-1 bg-[#0a0f0c] border border-[#F0EAD8]/10 px-3 py-2.5 text-sm text-[#F0EAD8] font-body rounded-lg focus:border-[#C9A864]/50 outline-none transition-colors"
                            />
                            <input
                              placeholder="Division"
                              value={newAddress.division}
                              onChange={(e) => handleNewAddressChange('division', e.target.value)}
                              className="flex-1 bg-[#0a0f0c] border border-[#F0EAD8]/10 px-3 py-2.5 text-sm text-[#F0EAD8] font-body rounded-lg focus:border-[#C9A864]/50 outline-none transition-colors"
                            />
                          </div>

                          <div className="flex gap-3 mt-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveNewAddress}
                              disabled={savingAddress}
                              className="flex-1 text-[#0a0f0c] text-xs uppercase tracking-wider py-2.5 rounded-lg disabled:opacity-50"
                              style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
                            >
                              {savingAddress ? 'Saving...' : 'Save Address'}
                            </motion.button>
                            {addresses.length > 0 && (
                              <button
                                onClick={() => setShowNewAddressForm(false)}
                                className="px-4 text-xs uppercase tracking-wider text-[#F0EAD8]/40 border border-[#F0EAD8]/10 rounded-lg"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* ============ কলাম ২ — অর্ডার সামারি ============ */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A864] font-body flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#C9A864] rounded-full inline-block" />
                  Order Summary
                </span>

                <div
                  className="border border-[#C9A864]/20 p-6 rounded-2xl relative overflow-hidden flex-1"
                  style={{
                    background: 'linear-gradient(160deg, rgba(13,20,16,0.95), rgba(201,168,100,0.04))',
                  }}
                >
                  <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-[#C9A864]/10 rounded-full blur-[60px]" />

                  <div className="relative z-10">
                    <h3 className="font-heading text-[#F0EAD8] text-xl mb-4">{product.name}</h3>

                    <div className="flex flex-col gap-2.5 mb-4">
                      {order_items.map((item, i) => (
                        <motion.div
                          key={item.variant_id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between"
                        >
                          <span className="font-body text-[#F0EAD8]/60 text-sm">
                            {item.volume_ml}ml × {item.quantity}
                          </span>
                          <span className="font-body text-[#F0EAD8]/80 text-sm">৳{item.subtotal}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F0EAD8]/5">
                      <span className="font-body text-[#F0EAD8]/50 text-xs uppercase tracking-wider">Fragrance Subtotal</span>
                      <span className="font-body text-[#F0EAD8] text-sm">৳{variants_subtotal}</span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-5 rounded-xl px-4 py-4 flex items-center justify-between border border-[#C9A864]/20"
                      style={{ background: 'linear-gradient(90deg, rgba(92,26,26,0.15), rgba(201,168,100,0.12), rgba(28,77,58,0.15))' }}
                    >
                      <span className="font-body text-[#F0EAD8]/70 text-xs uppercase tracking-[0.2em]">Grand Total</span>
                      <span className="font-heading text-[#C9A864] text-2xl">৳{grand_total}</span>
                    </motion.div>

                    {orderError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 px-4 py-2.5 rounded-lg border border-[#5C1A1A]/60 bg-[#011863]/10"
                      >
                        <span className="font-body text-[#F0EAD8]/70 text-xs">{orderError}</span>
                      </motion.div>
                    )}

                    <motion.button
                      onClick={handlePlaceOrder}
                      disabled={!selectedAddressId || placingOrder}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-5 rounded-xl py-4 text-sm font-heading uppercase tracking-widest text-[#0a0f0c] disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden flex items-center justify-center gap-3"
                      style={{
                        background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)',
                        backgroundSize: '200% 100%',
                      }}
                    >
                      {placingOrder ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-[#0a0f0c]/30 border-t-[#0a0f0c] rounded-full"
                          />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order & Pay with bKash'
                      )}
                    </motion.button>

                    <p className="font-body text-[#F0EAD8]/30 text-[11px] mt-3 text-center">
                      You'll be redirected to bKash to complete your payment securely.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(201, 168, 100, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(201, 168, 100, 0.5);
        }
      `}</style>
    </>
  );
}