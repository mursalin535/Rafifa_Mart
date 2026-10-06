import { useTheme } from '../../context/ThemeContext';

export default function BrassDivider({ symbol = '✦', className = '' }) {
  const { dark } = useTheme();

  return (
    <div className={`flex items-center gap-4 my-10 ${className}`}>
      <div className="flex-1 brass-hairline" />
      {symbol && <span className="text-[12px]" style={{ color: '#C9A864' }}>{symbol}</span>}
      <div className="flex-1 brass-hairline" />
    </div>
  );
}
