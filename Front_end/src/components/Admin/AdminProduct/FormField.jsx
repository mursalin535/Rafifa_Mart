export default function FormField({ label, required, dark, hint, children }) {
  return (
    <div>
      <label
        className="block font-heading text-[10px] tracking-[0.2em] uppercase mb-2"
        style={{ color: dark ? 'rgba(237,231,218,0.5)' : 'rgba(26,38,32,0.5)' }}
      >
        {label} {required && <span style={{ color: '#C9A864' }}>*</span>}
      </label>
      {children}
      {hint && (
        <p
          className="font-body text-[10px] mt-1"
          style={{ color: dark ? 'rgba(237,231,218,0.35)' : 'rgba(26,38,32,0.35)' }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}