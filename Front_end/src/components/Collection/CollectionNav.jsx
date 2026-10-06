import { motion } from 'framer-motion';
import { Flame, Droplet, User, Users, Sparkles, Wind, Leaf, Candy, X } from 'lucide-react';

const TYPE_OPTIONS = [
    { value: 'amber', label: 'Amber', icon: Flame, color: '#D98E3A' },
    { value: 'woody', label: 'Woody', icon: Leaf, color: '#8A6A3C' },
    { value: 'floral', label: 'Floral', icon: Sparkles, color: '#D98FB0' },
    { value: 'citrusy', label: 'Citrus', icon: Wind, color: '#B7C95A' },
    { value: 'gourmand', label: 'Gourmand', icon: Candy, color: '#C77B4E' },
    { value: 'fresh', label: 'Fresh', icon: Droplet, color: '#5FB3B0' },
];

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male', icon: User, color: '#6E9BC9' },
    { value: 'female', label: 'Female', icon: Users, color: '#D98FB0' },
];

function FilterGroup({ title, options, activeValue, field, onSelect }) {
    return (
        <div className="mb-6 sm:mb-8 lg:mb-10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#C9A864]/70 font-body block mb-3 sm:mb-5">
                {title}
            </span>
            <div className="flex flex-row flex-wrap lg:flex-col gap-2">
                {options.map(({ value, label, icon: Icon, color }) => {
                    const active = activeValue === value;
                    return (
                        <button
                            key={value}
                            onClick={() => onSelect(field, active ? 'all' : value)}
                            style={active ? { borderColor: `${color}66`, backgroundColor: `${color}14` } : {}}
                            className="group flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-body rounded-sm transition-all duration-300 text-left border border-transparent hover:bg-[#F0EAD8]/5"
                        >
                            <Icon
                                size={15}
                                strokeWidth={1.5}
                                style={{ color: active ? color : undefined }}
                                className={active ? '' : 'text-[#F0EAD8]/30 group-hover:text-[#F0EAD8]/60 transition-colors'}
                            />
                            <span
                                style={{ color: active ? color : undefined }}
                                className={`tracking-wide transition-colors ${active ? '' : 'text-[#F0EAD8]/50 group-hover:text-[#F0EAD8]/80'}`}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function CollectionNav({ set_nav_val, filters }) {

    const hasActiveFilters = filters.type !== 'all' || filters.gender !== 'all';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full border border-[#C9A864]/15 bg-[#0d1410] px-4 sm:px-5 lg:px-7 py-6 sm:py-8 lg:py-10 rounded-sm"
        >
            <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
                <h4 className="font-heading text-[#F0EAD8] text-lg sm:text-xl">Refine</h4>
                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            set_nav_val('type', 'all');
                            set_nav_val('gender', 'all');
                        }}
                        className="flex items-center gap-1 text-[10px] sm:text-[11px] uppercase tracking-wider text-[#F0EAD8]/40 hover:text-[#C9A864] transition-colors"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            <svg width="100%" height="12" viewBox="0 0 200 12" className="mb-5 sm:mb-6 lg:mb-8 opacity-40">
                <line x1="0" y1="6" x2="80" y2="6" stroke="#C9A864" strokeWidth="1" />
                <circle cx="100" cy="6" r="3" fill="none" stroke="#C9A864" strokeWidth="1" />
                <line x1="120" y1="6" x2="200" y2="6" stroke="#C9A864" strokeWidth="1" />
            </svg>

            <FilterGroup title="Fragrance Family" options={TYPE_OPTIONS} activeValue={filters.type} field="type" onSelect={set_nav_val} />
            <FilterGroup title="For" options={GENDER_OPTIONS} activeValue={filters.gender} field="gender" onSelect={set_nav_val} />
        </motion.div>
    );
}
