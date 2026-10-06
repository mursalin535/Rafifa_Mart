import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Floral',   value: 'floral',   color: '#FF6B9D', glow: '#FF6B9D', desc: 'Rose · Jasmine · Peony',        num: '01' },
  { name: 'Fresh',    value: 'fresh',    color: '#00E5CC', glow: '#00E5CC', desc: 'Ocean · Green · Aquatic',        num: '02' },
  { name: 'Woody',    value: 'woody',    color: '#D4A96A', glow: '#D4A96A', desc: 'Cedar · Sandalwood · Oud',       num: '03' },
  { name: 'Amber',    value: 'amber',    color: '#FFB347', glow: '#FFB347', desc: 'Vanilla · Musk · Resin',         num: '04' },
  { name: 'Gourmand', value: 'gourmand', color: '#FF8C69', glow: '#FF8C69', desc: 'Caramel · Coffee · Sweet',       num: '05' },
  { name: 'Citrusy',  value: 'citrusy',  color: '#FFE135', glow: '#FFE135', desc: 'Bergamot · Lemon · Orange Zest', num: '06' },
]

const GENDERS = [
  {
    name: 'Men', desc: 'Bold · Woody · Sharp', value: 'male',
    images: ['/men1.png', '/men2.png', '/men3.webp'],
  },
  {
    name: 'Women', desc: 'Soft · Floral · Elegant', value: 'female',
    images: ['/women1.png', '/women2.jpg', '/women3.png'],
  },
]

/* ── Right side option box — GLOWING version ── */
function OptionBox({ name, desc, images, active, onClick }) {
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images])

  return (
    <motion.button onClick={onClick}
      whileHover={{ y: -5, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.96 }}
      style={{
        borderRadius: '4px',
        boxShadow: active
          ? '0 0 28px rgba(201,168,100,0.35), 0 0 60px rgba(201,168,100,0.12), inset 0 0 20px rgba(201,168,100,0.08)'
          : '0 0 18px rgba(201,168,100,0.12), 0 0 40px rgba(201,168,100,0.05)',
      }}
      className={`relative flex flex-col items-center justify-center gap-4 w-full max-w-[449px] h-64 sm:h-72
        border cursor-pointer overflow-hidden group transition-all duration-250
        ${active
          ? 'border-[#C9A864] bg-[#C9A864]/12'
          : 'border-[#C9A864]/45 bg-[#0E0E0E] hover:border-[#C9A864] hover:bg-[#141410]'}`}
    >
      {/* Image carousel */}
      {images && images.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIndex}
              src={images[imgIndex]}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover will-change-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}

      {/* permanent subtle inner glow */}
      <span className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(201,168,100,0.06), transparent 65%)' }}/>

      {/* hover amplified glow */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,100,0.14), transparent 70%)' }}/>

      {/* all 4 corner brackets */}
      {[['top-2.5 left-2.5','border-t-2 border-l-2'],
        ['top-2.5 right-2.5','border-t-2 border-r-2'],
        ['bottom-2.5 left-2.5','border-b-2 border-l-2'],
        ['bottom-2.5 right-2.5','border-b-2 border-r-2']].map(([pos,bdr],i)=>(
        <span key={i} className={`absolute w-5 h-5 ${pos} ${bdr} transition-all duration-200
          ${active
            ? 'border-[#C9A864] opacity-100'
            : 'border-[#C9A864]/60 opacity-70 group-hover:opacity-100 group-hover:border-[#C9A864]'}`}/>
      ))}

      {/* top glow line — always visible, brighter on active */}
      <span className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: active
          ? 'linear-gradient(to right, transparent, rgba(201,168,100,0.9), transparent)'
          : 'linear-gradient(to right, transparent, rgba(201,168,100,0.35), transparent)' }}/>

      {/* bottom glow line */}
      <span className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: active ? '3px' : '1px',
          background: active
            ? 'linear-gradient(to right, transparent, #C9A864, transparent)'
            : 'linear-gradient(to right, transparent, rgba(201,168,100,0.3), transparent)',
        }}/>

      {/* active full inner wash */}
      {active && <span className="absolute inset-0 bg-gradient-to-b from-[#C9A864]/12 via-[#C9A864]/04 to-transparent pointer-events-none"/>}

      {/* name */}
      <span className="relative z-10 font-heading text-xs sm:text-[15px] tracking-[0.25em] sm:tracking-[0.38em] uppercase font-semibold transition-all duration-200"
        style={{
          color: active ? '#F0EAD8' : 'rgba(240,234,216,0.8)',
          textShadow: active ? '0 0 20px rgba(201,168,100,0.6)' : '0 0 10px rgba(201,168,100,0.2)',
        }}>
        {name}
      </span>

      {/* desc */}
      <span className="relative z-10 font-body text-[10px] tracking-[0.12em] text-center leading-snug transition-colors duration-200"
        style={{ color: active ? 'rgba(201,168,100,0.85)' : 'rgba(240,234,216,0.4)' }}>
        {desc}
      </span>
    </motion.button>
  )
}

export default function Category() {
  const [activeGender, setActiveGender] = useState(null)
  const [activeCat,    setActiveCat]    = useState(null)
  const navigate = useNavigate()

  const handleGenderClick = (gender) => {
    setActiveGender(gender.value)
    navigate('/products', { state: { gender: gender.value } })
  }

  const handleCategoryClick = (cat) => {
    setActiveCat(cat.value)
    navigate('/products', { state: { type: cat.value } })
  }

  return (
    <motion.div className="w-full min-h-screen bg-[#0A0A0A] relative overflow-hidden"
    initial={{opacity:0}}
    whileInView={{opacity:1}}
    viewport={{once:true,amount:0.1}}
    transition={{duration:0.5}}
    >

      {/* global subtle grid - hidden on mobile for performance */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="cGrid" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M52 0L0 0 0 52" fill="none" stroke="rgba(201,168,100,0.03)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cGrid)"/>
        {[['28','28','82','28'],['28','28','28','82'],
          ['calc(100%-28px)','28','calc(100%-82px)','28'],
          ['calc(100%-28px)','28','calc(100%-28px)','82'],
          ['28','calc(100%-28px)','82','calc(100%-28px)'],
          ['28','calc(100%-28px)','28','calc(100%-82px)'],
          ['calc(100%-28px)','calc(100%-28px)','calc(100%-82px)','calc(100%-28px)'],
          ['calc(100%-28px)','calc(100%-28px)','calc(100%-28px)','calc(100%-82px)'],
        ].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,168,100,0.16)" strokeWidth="0.7"/>
        ))}
      </svg>

      <div className="relative z-10 flex flex-col">

        {/* ══════════ GENDER PANEL (FIRST) ══════════ */}
        <div className="w-full min-h-[80vh] relative flex flex-col justify-center items-center
          gap-8 sm:gap-10 px-6 sm:px-10 md:px-12 xl:px-14 py-12 sm:py-20 overflow-hidden">

          {/* deep bg glow - simplified for mobile */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="hidden sm:block" style={{
              position:'absolute', top:'-5%', right:'-10%',
              width:'70%', height:'50%',
              background:'radial-gradient(ellipse at 70% 30%, rgba(92,26,26,0.35) 0%, transparent 70%)',
            }}/>
            <div className="hidden sm:block" style={{
              position:'absolute', bottom:'-5%', left:'-10%',
              width:'70%', height:'50%',
              background:'radial-gradient(ellipse at 30% 70%, rgba(19,32,26,0.3) 0%, transparent 70%)',
            }}/>
            <div className="absolute inset-0" style={{
              background:'radial-gradient(ellipse at 50% 50%, rgba(201,168,100,0.04) 0%, transparent 65%)',
            }}/>
          </div>

          {/* decorative SVG - hidden on mobile */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            viewBox="0 0 500 700" preserveAspectRatio="xMidYMid slice">
            <line x1="30" y1="30" x2="80"  y2="30"  stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="30" y1="30" x2="30"  y2="80"  stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="470" y1="30" x2="420" y2="30"  stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="470" y1="30" x2="470" y2="80"  stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="30" y1="670" x2="80"  y2="670" stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="30" y1="670" x2="30"  y2="620" stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="470" y1="670" x2="420" y2="670" stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <line x1="470" y1="670" x2="470" y2="620" stroke="rgba(201,168,100,0.28)" strokeWidth="1.2"/>
            <text x="250" y="55"  textAnchor="middle" fill="rgba(201,168,100,0.2)" fontSize="11" fontFamily="serif">✦</text>
            <text x="250" y="670" textAnchor="middle" fill="rgba(201,168,100,0.2)" fontSize="11" fontFamily="serif">✦</text>
          </svg>

          {/* eyebrow */}
          <motion.div className="relative z-10 flex items-center gap-3 sm:gap-4"
            initial={{ opacity:0, y:-12 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="w-4 sm:w-6 h-px bg-[#C9A864]/60"/>
            <span className="font-heading text-[#C9A864] text-lg sm:text-xl md:text-2xl lg:text-[27px] tracking-[0.3em] sm:tracking-[0.55em] uppercase">
              Fragrance For
            </span>
            <div className="flex-1 h-px bg-[#C9A864]/22"/>
          </motion.div>

          {/* Two cards side by side */}
          <motion.div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-16 lg:gap-24 w-full max-w-5xl"
            initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:0.15, duration:0.55 }}>
            {GENDERS.map(g => (
              <OptionBox key={g.name} name={g.name} desc={g.desc} images={g.images}
                active={activeGender===g.value}
                onClick={()=>handleGenderClick(g)}/>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            className="relative z-10 py-3 sm:py-4 font-heading text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] uppercase
              border text-[#C9A864] relative overflow-hidden group"
            style={{ borderRadius:'3px', borderColor:'rgba(201,168,100,0.5)' }}
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:0.3, duration:0.55 }}
            whileHover={{ borderColor:'rgba(201,168,100,1)', boxShadow:'0 0 20px rgba(201,168,100,0.2)' }}
            whileTap={{ scale:0.98 }}
          >
            <motion.span className="absolute inset-0 bg-[#C9A864]"
              initial={{ y:'100%' }} whileHover={{ y:0 }} transition={{ duration:0.26 }}/>
            <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-200">
              Explore Fragrances &nbsp;→
            </span>
          </motion.button>

        </div>
        <motion.div className='w-full h-[8vh]'/>

        {/* ══════════ SCENT FAMILY PANEL (SECOND) ══════════ */}
        <div className="w-full min-h-[80vh] relative flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-0 overflow-hidden">

          {/* ── RICH LEFT BG — green + red zones + shapes ── */}

          {/* large green sweep — top-left */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{
              position:'absolute', top:'-10%', left:'-8%',
              width:'65%', height:'55%',
              background:'radial-gradient(ellipse at 30% 40%, #13201A 0%, rgba(19,32,26,0.6) 45%, transparent 75%)',
            }}/>
            {/* red sweep — bottom-right */}
            <div style={{
              position:'absolute', bottom:'-10%', right:'-5%',
              width:'60%', height:'55%',
              background:'radial-gradient(ellipse at 70% 60%, #5C1A1A 0%, rgba(92,26,26,0.55) 45%, transparent 75%)',
            }}/>
            {/* subtle center blend */}
            <div style={{
              position:'absolute', top:'30%', left:'20%',
              width:'60%', height:'40%',
              background:'radial-gradient(ellipse at 50% 50%, rgba(19,32,26,0.25) 0%, rgba(92,26,26,0.15) 50%, transparent 80%)',
            }}/>
          </div>

          {/* ── Decorative shapes on left bg - hidden on mobile ── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            viewBox="0 0 700 680" preserveAspectRatio="xMidYMid slice">

            {/* large outer arc rings */}
            <circle cx="160" cy="340" r="310" fill="none" stroke="#13201A" strokeWidth="80" opacity="0.5"/>
            <circle cx="160" cy="340" r="310" fill="none" stroke="rgba(201,168,100,0.07)" strokeWidth="1"/>
            <circle cx="160" cy="340" r="250" fill="none" stroke="rgba(201,168,100,0.06)" strokeWidth="0.8"/>
            <circle cx="160" cy="340" r="185" fill="none" stroke="rgba(201,168,100,0.08)" strokeWidth="0.7"/>

            {/* cross-hair lines through circle center */}
            <line x1="20"  y1="340" x2="380" y2="340" stroke="rgba(201,168,100,0.1)" strokeWidth="0.8"/>
            <line x1="160" y1="160" x2="160" y2="520" stroke="rgba(201,168,100,0.1)" strokeWidth="0.8"/>

            {/* diagonal accent lines */}
            <line x1="0"   y1="680" x2="280" y2="0"   stroke="rgba(201,168,100,0.05)" strokeWidth="1"/>
            <line x1="80"  y1="680" x2="360" y2="0"   stroke="rgba(201,168,100,0.04)" strokeWidth="1"/>
            <line x1="420" y1="680" x2="700" y2="0"   stroke="rgba(92,26,26,0.12)"   strokeWidth="1"/>

            {/* large decorative hexagon */}
            <polygon points="160,60 300,140 300,300 160,380 20,300 20,140"
              fill="none" stroke="rgba(201,168,100,0.06)" strokeWidth="1.2"/>

            {/* scattered diamonds — prominent */}
            {[[60,100],[680,180],[55,570],[660,540],[370,60],[380,630],[200,80],[150,600]].map(([x,y],i)=>(
              <g key={i}>
                <polygon points={`${x},${y-10} ${x+10},${y} ${x},${y+10} ${x-10},${y}`}
                  fill="none" stroke="rgba(201,168,100,0.28)" strokeWidth="1"/>
                <polygon points={`${x},${y-5} ${x+5},${y} ${x},${y+5} ${x-5},${y}`}
                  fill="rgba(201,168,100,0.12)"/>
              </g>
            ))}

            {/* ✦ glyphs */}
            {[[50,55],[690,100],[40,650],[690,640],[350,30],[360,660]].map(([x,y],i)=>(
              <text key={i} x={x} y={y} fill="rgba(201,168,100,0.3)" fontSize="13" fontFamily="serif"
                textAnchor="middle">✦</text>
            ))}
            {[[690,350],[35,340]].map(([x,y],i)=>(
              <text key={i} x={x} y={y} fill="rgba(201,168,100,0.22)" fontSize="10" fontFamily="serif"
                textAnchor="middle">✧</text>
            ))}

            {/* top-right decorative arc (red zone accent) */}
            <path d="M 500 0 Q 700 0 700 200" fill="none" stroke="rgba(92,26,26,0.3)" strokeWidth="60" opacity="0.4"/>
            <path d="M 500 0 Q 700 0 700 200" fill="none" stroke="rgba(201,168,100,0.08)" strokeWidth="1"/>

            {/* bottom-left green arc */}
            <path d="M 0 480 Q 0 680 200 680" fill="none" stroke="rgba(19,32,26,0.5)" strokeWidth="60" opacity="0.5"/>
            <path d="M 0 480 Q 0 680 200 680" fill="none" stroke="rgba(201,168,100,0.08)" strokeWidth="1"/>

            {/* corner bracket marks */}
            <line x1="30" y1="30" x2="80" y2="30"  stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="30" y1="30" x2="30" y2="80"  stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="670" y1="30" x2="620" y2="30"  stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="670" y1="30" x2="670" y2="80"  stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="30" y1="650" x2="80"  y2="650" stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="30" y1="650" x2="30"  y2="600" stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="670" y1="650" x2="620" y2="650" stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>
            <line x1="670" y1="650" x2="670" y2="600" stroke="rgba(201,168,100,0.3)" strokeWidth="1.2"/>

            {/* fine horizontal rule lines across full width */}
            <line x1="0" y1="120" x2="700" y2="120" stroke="rgba(201,168,100,0.04)" strokeWidth="0.5"/>
            <line x1="0" y1="560" x2="700" y2="560" stroke="rgba(201,168,100,0.04)" strokeWidth="0.5"/>

            {/* small tick clusters */}
            {[200,300,400,500].map((x,i)=>(
              <g key={i}>
                <line x1={x} y1="115" x2={x} y2="125" stroke="rgba(201,168,100,0.25)" strokeWidth="0.8"/>
              </g>
            ))}
            {[200,300,400,500].map((x,i)=>(
              <g key={i}>
                <line x1={x} y1="555" x2={x} y2="565" stroke="rgba(201,168,100,0.25)" strokeWidth="0.8"/>
              </g>
            ))}
          </svg>

          {/* CSS animated floating shapes - hidden on mobile */}
          <style>{`
            @media (min-width: 768px) {
              @keyframes floatUp   { 0%{transform:translateY(0) rotate(45deg);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(-320px) rotate(45deg);opacity:0} }
              @keyframes floatDia  { 0%{transform:translateY(0) rotate(0deg);opacity:0}  10%{opacity:.8} 90%{opacity:.3} 100%{transform:translateY(-280px) rotate(90deg);opacity:0} }
              @keyframes sCW       { to{transform:rotate(360deg)} }
              @keyframes sCCW      { to{transform:rotate(-360deg)} }
            }
          `}</style>

          {/* drifting diamond particles - hidden on mobile */}
          <div className="hidden md:block">
          {[
            {left:'8%',  bottom:'15%', size:8,  dur:'9s',  delay:'0s'},
            {left:'18%', bottom:'8%',  size:5,  dur:'12s', delay:'2s'},
            {left:'60%', bottom:'5%',  size:7,  dur:'10s', delay:'1s'},
            {left:'72%', bottom:'20%', size:4,  dur:'14s', delay:'4s'},
            {left:'45%', bottom:'0%',  size:6,  dur:'11s', delay:'3s'},
            {left:'88%', bottom:'10%', size:5,  dur:'13s', delay:'1.5s'},
            {left:'30%', bottom:'3%',  size:9,  dur:'8s',  delay:'5s'},
            {left:'55%', bottom:'12%', size:4,  dur:'15s', delay:'0.5s'},
          ].map((p,i)=>(
            <div key={i} className="absolute pointer-events-none"
              style={{
                left: p.left, bottom: p.bottom,
                width: p.size, height: p.size,
                border: '1px solid rgba(201,168,100,0.45)',
                transform: 'rotate(45deg)',
                animation: `floatUp ${p.dur} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}
          </div>

          {/* ── actual content ── */}
          <div className="relative z-10 w-full max-w-6xl">

            {/* eyebrow */}
            <motion.div
              initial={{ opacity:0, y:-14 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}
              className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center"
            >
              <div className="w-4 sm:w-7 h-px bg-[#C9A864]/60"/>
              <span className="font-heading text-[#C9A864] text-lg sm:text-xl md:text-2xl lg:text-[25px] tracking-[0.3em] sm:tracking-[0.55em] uppercase">
                Browse by Scent Family
              </span>
              <div className="w-4 sm:w-7 h-px bg-[#C9A864]/60"/>
            </motion.div>

            {/* category cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  initial={{ opacity:0, y:30 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay: i*0.08, duration:0.5 }}
                  whileHover={{ y: -8, transition:{ duration:0.2 } }}
                  whileTap={{ scale:0.96 }}
                  className={`relative flex flex-col items-center justify-center gap-3 py-9 px-5
                    border cursor-pointer overflow-hidden group transition-all duration-300
                    ${activeCat === cat.value
                      ? 'border-[#C9A864] bg-[#C9A864]/12'
                      : 'border-[#C9A864]/30 bg-[#0E0E0E] hover:border-[#C9A864]/60 hover:bg-[#141410]'}`}
                  style={{
                    boxShadow: activeCat === cat.value
                      ? `0 0 30px ${cat.color}25, inset 0 0 20px ${cat.color}08`
                      : `0 0 15px rgba(201,168,100,0.08)`,
                  }}
                >
                  {/* corner brackets */}
                  <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#C9A864]/50"/>
                  <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#C9A864]/50"/>
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#C9A864]/50"/>
                  <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#C9A864]/50"/>

                  {/* color glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${cat.color}12, transparent 70%)` }}/>

                  {/* active glow */}
                  {activeCat === cat.value && (
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 50% 30%, ${cat.color}18, transparent 60%)` }}/>
                  )}

                  {/* number */}
                  <span className="font-heading text-[10px] tracking-[0.2em] transition-colors duration-200"
                    style={{ color: activeCat === cat.value ? cat.color : `${cat.color}80` }}>
                    {cat.num}
                  </span>

                  {/* color dot */}
                  <div className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: cat.color,
                      opacity: activeCat === cat.value ? 1 : 0.7,
                      boxShadow: activeCat === cat.value
                        ? `0 0 20px 6px ${cat.color}60`
                        : `0 0 8px 2px ${cat.color}30`,
                    }}/>

                  {/* name */}
                  <span className="font-heading text-2xl sm:text-3xl tracking-[0.15em] uppercase font-medium transition-all duration-200"
                    style={{
                      color: activeCat === cat.value ? cat.color : '#F0EAD8',
                      textShadow: activeCat === cat.value ? `0 0 25px ${cat.color}50` : 'none',
                    }}>
                    {cat.name}
                  </span>

                  {/* desc */}
                  <span className="font-body text-[11px] tracking-wide text-center transition-all duration-200"
                    style={{
                      color: activeCat === cat.value ? `${cat.color}CC` : 'rgba(240,234,216,0.4)',
                    }}>
                    {cat.desc}
                  </span>

                  {/* arrow */}
                  <span className="font-heading text-lg transition-all duration-200 mt-2"
                    style={{
                      color: cat.color,
                      opacity: activeCat === cat.value ? 1 : 0,
                      transform: activeCat === cat.value ? 'translateX(0)' : 'translateX(-10px)',
                    }}>
                    →
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}