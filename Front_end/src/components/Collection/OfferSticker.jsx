// product কার্ডের উপরে সোনালি গোল discount sticker (Offers page-এর স্টাইলের মতো)
export default function OfferSticker({ label, size = 'md', className = '' }) {
  if (!label) return null;

  const sizes = {
    md: 'w-11 h-11 sm:w-14 sm:h-14',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  // "−10%" বা "−৳50" থেকে মাইনাস চিহ্ন বাদ, কারণ sticker-এ "off" লেখা থাকে
  const text = String(label).replace('−', '');

  return (
    <div
      className={`rounded-full flex flex-col items-center justify-center pointer-events-none ${sizes[size] || sizes.md} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #e2c56b 0%, #c9a864 25%, #a88a42 55%, #c9a864 75%, #e2c56b 100%)',
        boxShadow:
          '0 3px 8px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.15)',
        border: '1.5px solid rgba(120,90,30,0.5)',
        transform: 'rotate(-8deg)',
      }}
    >
      <span
        className="font-heading text-[10px] sm:text-xs font-bold leading-none relative z-10"
        style={{ color: '#1a1200' }}
      >
        {text}
      </span>
      <span
        className="font-heading text-[7px] sm:text-[8px] font-bold leading-none uppercase relative z-10"
        style={{ color: '#1a1200' }}
      >
        off
      </span>
      {/* glossy sheen */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 35%, transparent 50%, rgba(0,0,0,0.08) 80%, rgba(0,0,0,0.15) 100%)',
        }}
      />
    </div>
  );
}