export default function WaxSeal({ letter = 'R', size = 'md', onClick, className = '' }) {
  const sizes = {
    sm: 'wax-seal-sm text-sm',
    md: 'wax-seal text-2xl',
    lg: 'wax-seal w-24 h-24 text-3xl',
  };

  return (
    <div className={`wax-seal ${sizes[size]} ${className}`} onClick={onClick}>
      <span className="font-cormorant italic text-parchment font-semibold">{letter}</span>
    </div>
  );
}
