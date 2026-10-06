import { motion } from 'framer-motion';
import TopCollection from './TopCollection';

const heading = "Our Top Collection";

export default function TopSection({ products, productImages, ratings, productVariants, offers, productOffers, bottles }) {
    return (
        <section className="w-full min-h-screen bg-[#0a0f0c] relative overflow-hidden flex flex-col lg:flex-row items-stretch">

            {/* ambient glow - responsive sizes */}
            <div className="pointer-events-none absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#C9A864]/10 blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 sm:-bottom-40 sm:-right-40 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#011863]/10 blur-[60px] sm:blur-[90px] lg:blur-[120px]" />

            {/* Left — editorial intro */}
            <div className="w-full lg:w-[32%] flex flex-col justify-center px-6 sm:px-8 py-12 sm:py-16 lg:px-16 relative z-10">

                <motion.span
                    initial={{ opacity: 0, letterSpacing: '0.1em' }}
                    whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-[10px] sm:text-xs uppercase text-[#C9A864] font-body mb-4 sm:mb-6"
                >
                    Curated Selection
                </motion.span>

                <h2 className="font-heading text-[#F0EAD8] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 sm:mb-6 flex flex-wrap">
                    {heading.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.03 }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </h2>

                {/* ornamental divider */}
                <motion.svg
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    width="120" height="20" viewBox="0 0 120 20" className="mb-4 sm:mb-6"
                >
                    <line x1="0" y1="10" x2="45" y2="10" stroke="#C9A864" strokeWidth="1" />
                    <circle cx="60" cy="10" r="4" fill="none" stroke="#C9A864" strokeWidth="1" />
                    <line x1="75" y1="10" x2="120" y2="10" stroke="#C9A864" strokeWidth="1" />
                </motion.svg>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="font-body text-[#F0EAD8]/60 text-xs sm:text-sm leading-relaxed max-w-xs"
                >
                    A rotating showcase of our highest-rated fragrances — chosen by those who wear them.
                </motion.p>
            </div>

            {/* Right — showcase */}
            <div className="w-full lg:w-[68%] relative z-10 bg-[#13201A]">
                <TopCollection
                    products={products}
                    productImages={productImages}
                    ratings={ratings}
                    productVariants={productVariants}
                    offers={offers}
                    productOffers={productOffers}
                    bottles={bottles}
                />
            </div>
        </section>
    );
}
