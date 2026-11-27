import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Get_addresses, Add_address } from '../Server/address';
import { Add_bottle_order } from '../Server/order';

const GOLD = '#C9A864';
const CREAM = '#F0EAD8';

// ঠিকানার ফর্ম: CheckOut আর Profile-এর সাথে একই নিয়ম
// Area ঘরটা database-এর district column-এ যায়
const PHONE_RE = /^01[3-9][0-9]{8}$/;
const POSTAL_RE = /^[0-9]{4}$/;

const REQUIRED_FIELDS = {
    label: 'House name',
    recipient_name: 'Receiver name',
    phone: 'Phone number',
    address_line1: 'Address',
    district: 'Area',
    city: 'City',
    division: 'Division',
    postal_code: 'Postal code',
};

function validateAddress(addr) {
    const errors = {};

    for (const [key, label] of Object.entries(REQUIRED_FIELDS)) {
        if (!String(addr[key] || '').trim()) {
            errors[key] = `${label} is required.`;
        }
    }

    if (!errors.phone) {
        const cleanPhone = String(addr.phone).replace(/[\s-]/g, '');
        if (!PHONE_RE.test(cleanPhone)) {
            errors.phone = 'Phone number must be 11 digits and start with 01 (e.g. 017XXXXXXXX).';
        }
    }

    if (!errors.postal_code && !POSTAL_RE.test(String(addr.postal_code).trim())) {
        errors.postal_code = 'Postal code must be 4 digits.';
    }

    return errors;
}

// একটা input + তার নিচে নিজের error message
function AddressInput({ name, placeholder, value, error, onChange, className = '' }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#0a0f0c]/60 border px-3 py-2.5 text-sm text-[#F0EAD8] font-body rounded-sm placeholder:text-[#F0EAD8]/20 focus:outline-none transition-colors"
                style={{ borderColor: error ? '#e08a8a' : 'rgba(240,234,216,0.15)' }}
                onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = 'rgba(201,168,100,0.4)'; }}
                onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'rgba(240,234,216,0.15)'; }}
            />
            {error && (
                <span className="font-body text-[11px]" style={{ color: '#e08a8a' }}>{error}</span>
            )}
        </div>
    );
}

/* ═══════════ BOTTLE SVG ═══════════ */
function BottleSVG({ className = '' }) {
    return (
        <svg viewBox="0 0 50 80" fill="none" className={className}>
            <path d="M25 3 C22 3,20 6,20 10 L20 18 C15 20,12 25,12 31 L12 62 C12 68,16 72,22 72 L28 72 C34 72,38 68,38 62 L38 31 C38 25,35 20,30 18 L30 10 C30 6,28 3,25 3Z"
                stroke={GOLD} strokeWidth="1.3" />
            <rect x="20" y="0" width="10" height="5" rx="1.5" stroke={GOLD} strokeWidth="1" />
        </svg>
    );
}

const EMPTY_ADDR = {
    label: '',
    recipient_name: '',
    phone: '',
    address_line1: '',
    district: '',
    city: '',
    division: '',
    postal_code: '',
};

export default function BottleDetails() {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const state = location.state;
    const bottleId = Number(id);
    const bottle = state?.bottle;

    const [quantity, setQuantity] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [addressError, setAddressError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const [newAddress, setNewAddress] = useState(EMPTY_ADDR);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login', { state: { redirectTo: `/bottles/${bottleId}` } });
        }
    }, [authLoading, user, navigate, bottleId]);

    useEffect(() => {
        async function fetchAddresses() {
            if (!user) {
                setAddressesLoading(false);
                return;
            }
            try {
                const res = await Get_addresses(user.id);
                const addressList = (Array.isArray(res) ? res : res?.data ?? []).filter(a => a && a.id);
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

    if (!bottle) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0f0c]">
                <span className="font-body text-[#F0EAD8]/50 text-sm">Bottle not found.</span>
            </div>
        );
    }

    const unitPrice = Number(bottle.price_per_piece);
    const stock = Math.max(0, Number(bottle.total_piece) || 0);
    const maxQuantity = Math.min(stock, 100);
    const outOfStock = stock === 0;
    const subtotal = unitPrice * quantity;

    function updateQuantity(delta) {
        // 1 এর নিচে আর stock (সর্বোচ্চ ১০০) এর উপরে যাবে না
        setQuantity(prev => Math.min(Math.max(1, maxQuantity), Math.max(1, prev + delta)));
    }

    function handleNewAddressChange(field, value) {
        setNewAddress(prev => ({ ...prev, [field]: value }));
        // ঘরে লেখা শুরু করলেই ওই ঘরের error মুছে যায়
        setFieldErrors(prev => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }

    async function handleSaveNewAddress() {
        if (!user) return;
        setAddressError(null);

        // সব compulsory ঘর আর phone/postal code ফর্মেই চেক (server-ও আবার যাচাই করে)
        const errors = validateAddress(newAddress);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            setAddressError('Please fix the highlighted fields.');
            return;
        }

        setSavingAddress(true);
        try {
            // customer_id server session থেকে নেয়, পাঠানো লাগে না
            const res = await Add_address(newAddress);

            if (!res?.success || !res?.data?.id) {
                setAddressError(res?.message || 'Could not save the address. Please try again.');
                return;
            }

            setAddresses(prev => [...prev, res.data]);
            setSelectedAddressId(res.data.id);
            setNewAddress(EMPTY_ADDR);
            setFieldErrors({});
            setShowNewAddressForm(false);
        } catch (err) {
            console.error('Failed to save address:', err);
            setAddressError('Could not save the address. Please try again.');
        } finally {
            setSavingAddress(false);
        }
    }

    async function handlePlaceOrder() {
        if (!selectedAddressId || outOfStock) return;
        setPlacingOrder(true);
        setOrderError(null);

        try {
            // customer_id server session থেকে নেয়, পাঠানো লাগে না
            const payload = {
                address_id: selectedAddressId,
                payment_method: 'cod',
                items: [
                    {
                        bottle_id: bottleId,
                        quantity,
                    },
                ],
            };

            const res = await Add_bottle_order(payload);

            if (res?.success) {
                alert('Order placed successfully!');
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
        <div className='w-full h-[13vh] bg-[#0a0f0c]' />
        <div className="w-full min-h-[87vh] bg-[#0a0f0c] overflow-hidden flex flex-col">
            <div className="w-full flex-1 flex flex-col lg:flex-row gap-8 pt-10 px-6 lg:px-10 pb-8 overflow-auto min-h-0">

                {/* ═══════════ LEFT — Description + Address ═══════════ */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-[35%] min-w-0 flex flex-col gap-6"
                >
                    {/* Description */}
                    <motion.div className='w-full h-[2vh]'/>
                    <div className="border border-[#C9A864]/10 bg-[#0d1410] p-7 rounded-sm">
                        <h2
                            className="font-heading text-3xl mt-2 mb-4 bg-clip-text text-transparent bg-[length:200%_100%]"
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #C9A864 0%, #F0EAD8 25%, #C9A864 50%, #F0EAD8 75%, #C9A864 100%)',
                                animation: 'shimmer 4s linear infinite',
                            }}
                        >
                            Description
                        </h2>
                        <p className="font-body text-[#F0EAD8]/70 text-base leading-relaxed">
                            {bottle.description || 'No description available for this bottle.'}
                        </p>
                    </div>

                    {/* Address Section */}
                    <div className="border border-[#C9A864]/10 bg-[#0d1410] p-7 rounded-sm">
                        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A864] font-body mb-4 block">
                            Delivery Address
                        </span>

                        {addressesLoading ? (
                            <span className="font-body text-[#F0EAD8]/30 text-xs">Loading addresses...</span>
                        ) : (
                            <>
                                {/* Existing addresses */}
                                {!showNewAddressForm && addresses.length > 0 && (
                                    <div className="flex flex-col gap-2.5 mb-4">
                                        {addresses.map((addr) => {
                                            const active = selectedAddressId === addr.id;
                                            return (
                                                <button
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    style={active ? { borderColor: `${GOLD}66`, backgroundColor: `${GOLD}14` } : {}}
                                                    className="group flex flex-col items-start gap-1 px-4 py-3 text-left rounded-sm transition-all duration-300 border border-transparent hover:bg-[#F0EAD8]/5"
                                                >
                                                    <div className="flex items-center gap-2 w-full">
                                                        <span className={`text-sm font-heading ${active ? 'text-[#C9A864]' : 'text-[#F0EAD8]/70'}`}>
                                                            {addr.label || 'Address'}
                                                        </span>
                                                        {addr.is_default === 1 && (
                                                            <span className="text-[9px] uppercase tracking-wider text-[#C9A864]/60 border border-[#C9A864]/20 px-1.5 py-0.5 rounded-sm">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    {addr.recipient_name && (
                                                        <span className="font-body text-[#F0EAD8]/60 text-xs">
                                                            {addr.recipient_name}{addr.phone ? ` · ${addr.phone}` : ''}
                                                        </span>
                                                    )}
                                                    <span className="font-body text-[#F0EAD8]/40 text-xs leading-relaxed">
                                                        {addr.address_line1}
                                                        {addr.district ? `, ${addr.district}` : ''}
                                                        {addr.city ? `, ${addr.city}` : ''}
                                                        {addr.division ? `, ${addr.division}` : ''}
                                                        {addr.postal_code ? ` — ${addr.postal_code}` : ''}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Add new address button */}
                                {!showNewAddressForm && (
                                    <button
                                        onClick={() => { setAddressError(null); setFieldErrors({}); setShowNewAddressForm(true); }}
                                        className="w-full py-2.5 rounded-sm border border-dashed border-[#C9A864]/20 text-[#C9A864]/60 text-[11px] uppercase tracking-[0.15em] font-body hover:border-[#C9A864]/50 hover:text-[#C9A864] transition-all duration-300"
                                    >
                                        + Add New Address
                                    </button>
                                )}

                                {/* New address form */}
                                {showNewAddressForm && (
                                    <div className="flex flex-col gap-3">
                                        <AddressInput name="label" placeholder="House Name *" value={newAddress.label} error={fieldErrors.label} onChange={handleNewAddressChange} />
                                        <AddressInput name="recipient_name" placeholder="Receiver Name *" value={newAddress.recipient_name} error={fieldErrors.recipient_name} onChange={handleNewAddressChange} />
                                        <AddressInput name="phone" placeholder="Phone Number * (e.g. 017XXXXXXXX)" value={newAddress.phone} error={fieldErrors.phone} onChange={handleNewAddressChange} />
                                        <AddressInput name="address_line1" placeholder="Address *" value={newAddress.address_line1} error={fieldErrors.address_line1} onChange={handleNewAddressChange} />

                                        <div className="flex gap-3 items-start">
                                            <AddressInput className="flex-1" name="district" placeholder="Area *" value={newAddress.district} error={fieldErrors.district} onChange={handleNewAddressChange} />
                                            <AddressInput className="flex-1" name="city" placeholder="City *" value={newAddress.city} error={fieldErrors.city} onChange={handleNewAddressChange} />
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <AddressInput className="flex-1" name="division" placeholder="Division *" value={newAddress.division} error={fieldErrors.division} onChange={handleNewAddressChange} />
                                            <AddressInput className="flex-1" name="postal_code" placeholder="Postal Code * (4 digits)" value={newAddress.postal_code} error={fieldErrors.postal_code} onChange={handleNewAddressChange} />
                                        </div>

                                        {addressError && (
                                            <div className="border border-red-500/30 bg-red-500/10 rounded-sm px-4 py-2.5">
                                                <span className="font-body text-xs" style={{ color: '#e08a8a' }}>{addressError}</span>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-1">
                                            {addresses.length > 0 && (
                                                <button
                                                    onClick={() => { setAddressError(null); setFieldErrors({}); setShowNewAddressForm(false); }}
                                                    className="flex-1 py-2.5 rounded-sm border border-[#F0EAD8]/15 text-[#F0EAD8]/50 text-[11px] uppercase tracking-wider font-body hover:border-[#F0EAD8]/30 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={handleSaveNewAddress}
                                                disabled={savingAddress}
                                                className="flex-1 py-2.5 rounded-sm text-[11px] uppercase tracking-wider font-body text-[#0a0f0c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                style={{ background: `linear-gradient(90deg, ${GOLD}, ${CREAM}, ${GOLD})` }}
                                            >
                                                {savingAddress ? 'Saving...' : 'Save Address'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>

                {/* ═══════════ CENTER — Bottle Image ═══════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full lg:w-[30%] min-w-0 flex flex-col items-center justify-center gap-8"
                >
                    <div className="text-center">
                        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A864] font-body mb-2 block">
                            {bottle.volume} Bottle
                        </span>
                        <h1 className="font-heading text-[#F0EAD8] text-3xl lg:text-4xl capitalize leading-tight">
                            {bottle.name}
                        </h1>
                    </div>

                    <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'conic-gradient(from 0deg, #C9A864, transparent 30%, transparent 70%, #C9A864, #F0EAD8)',
                                padding: '3px',
                            }}
                        >
                            <div className="w-full h-full rounded-full bg-[#0a0f0c]" />
                        </motion.div>

                        <div className="absolute inset-[10px] rounded-full border border-[#C9A864]/25" />

                        <div className="absolute inset-[16px] rounded-full overflow-hidden bg-[#0d1410] flex items-center justify-center">
                            {bottle.photo_url ? (
                                <img src={bottle.photo_url} alt={bottle.name} className="w-full h-full object-cover" />
                            ) : (
                                <BottleSVG className="w-20 h-32 opacity-25" />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ═══════════ RIGHT — Info + Quantity + Order ═══════════ */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full lg:w-[35%] min-w-0 flex flex-col gap-6"
                >
                    <motion.div className="w-full h-[2vh]" />

                    {/* Marketing heading */}
                    <div className="px-1">
                        <h2
                            className="font-heading text-2xl leading-snug mb-3 bg-clip-text text-transparent bg-[length:200%_100%]"
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #C9A864 0%, #F0EAD8 30%, #C9A864 60%, #F0EAD8 100%)',
                                animation: 'shimmer 5s linear infinite',
                            }}
                        >
                            Own Your Vessel
                        </h2>
                        <p className="font-body text-[12px] text-[#F0EAD8]/50 leading-relaxed">
                            A <span className="font-heading text-[13px]" style={{ color: GOLD }}>{bottle.volume}</span> bottle, crafted to hold your favorite fragrance. Select quantity and proceed to checkout.
                        </p>
                    </div>

                    {/* Price + Quantity */}
                    <div className="border border-[#C9A864]/15 bg-[#0d1410] p-6 rounded-[16px] shadow-[0_0_25px_rgba(201,168,100,0.08)]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className="text-xs uppercase tracking-[0.2em] text-[#C9A864]/70 font-body block mb-1">
                                    Price per piece
                                </span>
                                <span className="font-heading text-[#C9A864] text-3xl">
                                    ৳{unitPrice}
                                </span>
                            </div>
                            <span
                                className="font-body text-[11px] uppercase"
                                style={{ color: outOfStock ? '#e08a8a' : 'rgba(240,234,216,0.3)' }}
                            >
                                {outOfStock ? 'Out of stock' : `${stock} pcs in stock`}
                            </span>
                        </div>

                        {/* Quantity selector */}
                        <div className="flex items-center justify-between rounded-[12px] border border-[#F0EAD8]/12 px-4 py-3">
                            <span className="font-heading text-sm text-[#F0EAD8]">Quantity</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(-1)}
                                    disabled={quantity <= 1 || outOfStock}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0EAD8]/15 text-[#F0EAD8]/60 transition-all duration-200 hover:border-[#C9A864] hover:text-[#C9A864] disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center font-body text-lg text-[#F0EAD8]">{quantity}</span>
                                <button
                                    onClick={() => updateQuantity(1)}
                                    disabled={quantity >= maxQuantity || outOfStock}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0EAD8]/15 text-[#F0EAD8]/60 transition-all duration-200 hover:border-[#C9A864] hover:text-[#C9A864] disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border border-[#C9A864]/15 bg-[#0d1410] rounded-[16px] p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="font-body text-[#F0EAD8]/70 text-xs uppercase tracking-[0.2em]">
                                Subtotal ({quantity} item{quantity !== 1 ? 's' : ''})
                            </span>
                            <span className="font-heading text-[#C9A864] text-2xl">৳{subtotal}</span>
                        </div>
                    </div>

                    {/* Order error */}
                    {orderError && (
                        <div className="border border-red-500/30 bg-red-500/10 rounded-sm px-4 py-3">
                            <span className="font-body text-red-400 text-xs">{orderError}</span>
                        </div>
                    )}

                    {/* Place Order button */}
                    <motion.button
                        onClick={handlePlaceOrder}
                        disabled={!selectedAddressId || placingOrder || outOfStock}
                        whileHover={{ letterSpacing: '0.15em', scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="mb-1 w-full shrink-0 rounded-[14px] py-4 text-sm font-heading uppercase tracking-[0.2em] text-[#0a0f0c] shadow-[0_0_20px_rgba(201,168,100,0.12)] disabled:cursor-not-allowed disabled:opacity-30"
                        style={{ background: 'linear-gradient(90deg, #C9A864, #F0EAD8, #C9A864)' }}
                    >
                        {placingOrder ? 'Placing Order...' : outOfStock ? 'Out of Stock' : 'Place Order'}
                    </motion.button>
                </motion.div>

            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
        </>
    );
}