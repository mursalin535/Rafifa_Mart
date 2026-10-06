import { motion, AnimatePresence } from 'framer-motion'
import { Get_products } from '../Server/product'
import { Get_all_product_images } from '../Server/product_image'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CYCLE_INTERVAL = 3200

/* ── Thin vintage rule used as section ornament ── */
function VintageRule() {
  return (
    <svg width="220" height="18" viewBox="0 0 220 18" aria-hidden="true" className="mx-auto">
      <line x1="0" y1="9" x2="80" y2="9" stroke="#C9A864" strokeWidth="0.8" opacity="0.55" />
      <path d="M88 9 L96 3 L104 15 L112 3 L120 9" fill="none" stroke="#C9A864" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" />
      <line x1="128" y1="9" x2="220" y2="9" stroke="#C9A864" strokeWidth="0.8" opacity="0.55" />
    </svg>
  )
}

/* ── Category tags replacing Top/Heart/Base rows ── */
function CategoryTags({ categories }) {
  if (!categories || categories.length === 0) return null
  return (
    <div className="py-4 border-t border-b border-[#C9A864]/10">
      <p className="font-heading text-[#C9A864]/50 text-[8px] tracking-[0.4em] uppercase mb-3">
        Fragrance Family
      </p>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="font-heading text-[10px] tracking-[0.18em] uppercase text-[#C9A864] border border-[#C9A864]/40 px-3 py-1 rounded-sm bg-[#C9A864]/5"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Compact thumb card (left column) ── */
function ProductThumb({ item, isActive, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.22 }}
      className="relative flex items-center gap-3 w-full focus:outline-none group"
    >
      <div className={`w-[2px] self-stretch rounded-full transition-all duration-400 ${
        isActive ? 'bg-[#C9A864]' : 'bg-[#C9A864]/15 group-hover:bg-[#C9A864]/35'
      }`} />

      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
        <div className="absolute inset-0 bg-[#13201A]" />
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isActive ? 'opacity-90' : 'opacity-55 group-hover:opacity-75'
            }`}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className={`absolute inset-0 w-full h-full flex items-center justify-center text-[#C9A864]/30 text-xl font-heading transition-opacity duration-300 ${
            isActive ? 'opacity-90' : 'opacity-55 group-hover:opacity-75'
          }`}>
            {item.name?.[0]}
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 ring-1 ring-[#C9A864]/70 rounded" />
        )}
      </div>

      <div className="flex flex-col items-start text-left min-w-0">
        <span className="font-heading text-[#C9A864]/40 text-[8px] tracking-[0.3em] mb-0.5">
          0{index + 1}
        </span>
        <span className={`font-heading text-[11px] tracking-[0.12em] uppercase leading-tight transition-colors duration-300 ${
          isActive ? 'text-[#F0EAD8]' : 'text-[#F0EAD8]/45 group-hover:text-[#F0EAD8]/70'
        }`}>
          {item.name}
        </span>
        {isActive && (
          <motion.div
            layoutId="thumb-underline"
            className="w-full h-px bg-[#C9A864]/50 mt-1"
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-auto shrink-0"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polyline points="10,0 0,0 0,10" fill="none" stroke="#C9A864" strokeWidth="1.5" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

/* ══════════════════════════════════════════════ */
export default function Collection_overview() {
  const [products, setProducts] = useState([])
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, imagesRes] = await Promise.all([
          Get_products(),
          Get_all_product_images(),
        ])

        const productsList = Array.isArray(productsRes) ? productsRes : productsRes?.data ?? []
        const imagesList = Array.isArray(imagesRes) ? imagesRes : imagesRes?.data ?? []

        if (productsList.length === 0) return

        const imgMap = {}
        imagesList.forEach((img) => {
          if (!imgMap[img.product_id]) imgMap[img.product_id] = img
          if (img.is_primary) imgMap[img.product_id] = img
        })

        const enriched = productsList.map((p) => ({
          ...p,
          img: imgMap[p.id]?.image_url || null,
          categories: p.available_categories
            ? p.available_categories.split(', ').filter(Boolean)
            : [],
          price: p.min_price ? `৳ ${Number(p.min_price).toLocaleString()}` : null,
        }))

        const shuffled = [...enriched].sort(() => Math.random() - 0.5)
        setProducts(shuffled.slice(0, 4))
      } catch {
        // ignore
      }
    }
    fetchData()
  }, [])

  const displayProducts = products

  useEffect(() => {
    if (displayProducts.length === 0) return
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % displayProducts.length)
    }, CYCLE_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [displayProducts.length])

  const handleThumbClick = (i) => {
    clearInterval(timerRef.current)
    setActive(i)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % displayProducts.length)
    }, CYCLE_INTERVAL)
  }

  const selected = displayProducts[active] ?? displayProducts[0]

  return (
    <motion.section
      className="w-full bg-[#0A0A0A] flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-10"
     initial={{x:100,opacity:0}}
    whileInView={{x:0,opacity:1}}
    viewport={{once:true,amount:0.3}}
    transition={{delay:0.2,duration:0.6}}
    >

      {/* ── Section header ── */}
      <div className="w-full max-w-6xl mb-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="w-8 h-[1px] bg-[#C9A864]/60" />
          <span className="font-heading text-[#C9A864] text-[9px] tracking-[0.5em] uppercase">
            The Collection
          </span>
          <div className="w-8 h-[1px] bg-[#C9A864]/60" />
        </div>
        <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl tracking-wide text-center">
          Scents that speak first.
        </h2>
        <VintageRule />
      </div>

      {/* ── Main panel ── */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">

        {/* ══ LEFT: compact vertical thumb list ══ */}
        <div
          className="w-full lg:w-[26%] flex flex-col justify-center gap-1 border border-[#C9A864]/10 rounded-xl px-5 py-6"
          style={{ background: 'linear-gradient(160deg, #0F1A10 0%, #0A0A0A 100%)' }}
        >
          <div className="mb-5">
            <p className="font-heading text-[#C9A864]/50 text-[8px] tracking-[0.4em] uppercase mb-1">
              Browse
            </p>
            <div className="w-10 h-px bg-[#C9A864]/25" />
          </div>

          <div className="flex flex-col gap-4">
            {displayProducts.map((item, i) => (
              <ProductThumb
                key={item.id ?? item.slug ?? i}
                item={item}
                isActive={i === active}
                onClick={() => handleThumbClick(i)}
                index={i}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-7 w-full h-[1px] bg-[#C9A864]/10 relative overflow-hidden rounded-full">
            <motion.div
              key={active}
              className="absolute left-0 top-0 h-full bg-[#C9A864]/50"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: CYCLE_INTERVAL / 1000, ease: 'linear' }}
            />
          </div>
          <p className="font-heading text-[#C9A864]/25 text-[8px] tracking-[0.3em] mt-1.5 text-right">
            {String(active + 1).padStart(2, '0')} / {String(displayProducts.length).padStart(2, '0')}
          </p>
        </div>

        {/* ══ RIGHT: single column — image then details ══ */}
        <div className="w-full lg:w-[74%] relative rounded-xl overflow-hidden border border-[#C9A864]/10"
          style={{ background: 'linear-gradient(175deg, #13201A 0%, #0A0A0A 55%, #1A0A0A 100%)' }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C9A864]/30 pointer-events-none z-20" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#C9A864]/30 pointer-events-none z-20" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#C9A864]/30 pointer-events-none z-20" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#C9A864]/30 pointer-events-none z-20" />

          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#011863]/12 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#13201A]/30 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/4 pointer-events-none" />
          <div className="absolute inset-0 bg-[#C9A864]/[0.015] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={selected?.slug ?? active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative z-10 flex flex-col h-full"
            >
              {/* ── Product image ── */}
              <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden rounded-t-xl shrink-0 border-2 border-e-cyan-800 bg-[#064c36]">
                {selected?.img ? (
                  <img
                    src={selected.img}
                    alt={selected?.name}
                    className="w-full h-full object-contain opacity-85"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C9A864]/30 text-6xl font-heading">
                    {selected?.name?.[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#13201A]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/40" />

                {/* Price badge */}
                <div className="absolute top-4 left-5 z-10">
                  <div className="flex items-center gap-2 bg-[#0A0A0A]/75 border border-[#C9A864]/35 px-3 py-1.5 backdrop-blur-sm">
                    <span className="font-heading text-[#C9A864] text-[11px] tracking-[0.15em]">
                      {selected?.price ?? '৳ —'}
                    </span>
                  </div>
                </div>

                {/* Index badge */}
                <div className="absolute top-4 right-5 z-10">
                  <span className="font-heading text-[#F0EAD8]/35 text-[10px] tracking-[0.35em]">
                    {String(active + 1).padStart(2, '0')} / {String(displayProducts.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* ── Detail panel ── */}
              <div className="flex flex-col px-7 sm:px-9 pt-5 pb-8 gap-4">

                {/* Name + decorative rule */}
                <div>
                  <h3 className="font-heading text-[#F0EAD8] text-2xl sm:text-3xl tracking-wide leading-tight mb-2">
                    {selected?.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-[#C9A864]" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A864]/60" />
                    <div className="flex-1 h-px bg-[#C9A864]/15" />
                  </div>
                </div>

                {/* Description */}
                <p className="font-body text-[#F0EAD8]/60 text-sm leading-relaxed">
                  {selected?.description}
                </p>

                {/* ── Category tags (replaces Top/Heart/Base) ── */}
                <CategoryTags categories={selected?.categories} />

                {/* CTA row */}
                <div className="flex items-center justify-between pt-1">
                  {/* Dot indicators */}
                  <div className="flex gap-2">
                    {displayProducts.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleThumbClick(i)}
                        className={`transition-all duration-500 rounded-full ${
                          i === active
                            ? 'w-5 h-1 bg-[#C9A864]'
                            : 'w-1 h-1 bg-[#C9A864]/25 hover:bg-[#C9A864]/50'
                        }`}
                        aria-label={`Select ${displayProducts[i].name}`}
                      />
                    ))}
                  </div>

                  {/* ── Show More — solid gold, more visible ── */}
                  <button
                    onClick={() => navigate('/collections')}
                    className="font-heading text-[11px] tracking-[0.25em] uppercase px-8 py-3 bg-[#C9A864] text-[#0A0A0A] hover:bg-[#F0EAD8] transition-all duration-300 relative group flex items-center gap-2.5"
                  >
                    Explore Collection
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </motion.section>
  )
}