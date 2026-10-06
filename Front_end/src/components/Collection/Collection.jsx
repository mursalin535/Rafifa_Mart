import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { Get_bottles } from '../Server/bottle';
import { Get_offers } from '../Server/offer';
import { Get_products } from '../Server/product';
import { Get_product_offers } from '../Server/product_offer';
import { Get_all_ratings } from '../Server/rating';
import { Get_product_images } from '../Server/product_image';
import { Get_all_variants } from '../Server/product';

import TopSection from './TopSection';
import BottomSection from './BottomSection';

function OrnamentalDivider() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-[20vh] sm:min-h-[30vh] lg:min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-20"
        >
            <div className="w-full max-w-5xl flex items-center gap-4 sm:gap-6 lg:gap-12">

                {/* left scrollwork */}
                <motion.svg
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 origin-right"
                    viewBox="0 0 300 40" preserveAspectRatio="none"
                >
                    <g fill="none" stroke="#C9A864" strokeWidth="1">
                        <path d="M2 20 C10 8, 20 8, 28 20 C20 32, 10 32, 2 20 Z" />
                        <circle cx="2" cy="20" r="2" fill="#C9A864" />
                        <path d="M28 20 C 120 4, 220 4, 296 20" />
                        <path d="M28 20 C 120 36, 220 36, 296 20" />
                    </g>
                </motion.svg>

                {/* center compass star */}
                <motion.svg
                    initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    width="56" height="56" viewBox="0 0 56 56"
                    className="flex-shrink-0 hidden sm:block"
                >
                    <g fill="none" stroke="#C9A864" strokeWidth="1">
                        {/* main cross */}
                        <line x1="28" y1="2" x2="28" y2="54" />
                        <line x1="2" y1="28" x2="54" y2="28" />
                        {/* diagonal cross, shorter */}
                        <line x1="12" y1="12" x2="44" y2="44" strokeWidth="0.6" />
                        <line x1="44" y1="12" x2="12" y2="44" strokeWidth="0.6" />
                        {/* arrowheads on main points */}
                        <path d="M28 2 L24 10 L32 10 Z" fill="#C9A864" stroke="none" />
                        <path d="M28 54 L24 46 L32 46 Z" fill="#C9A864" stroke="none" />
                        <path d="M2 28 L10 24 L10 32 Z" fill="#C9A864" stroke="none" />
                        <path d="M54 28 L46 24 L46 32 Z" fill="#C9A864" stroke="none" />
                        {/* center diamond */}
                        <circle cx="28" cy="28" r="4" fill="none" />
                        <circle cx="28" cy="28" r="1.5" fill="#C9A864" />
                    </g>
                </motion.svg>

                {/* right scrollwork (mirrored) */}
                <motion.svg
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 origin-left"
                    viewBox="0 0 300 40" preserveAspectRatio="none"
                >
                    <g fill="none" stroke="#C9A864" strokeWidth="1">
                        <path d="M298 20 C 290 8, 280 8, 272 20 C 280 32, 290 32, 298 20 Z" />
                        <circle cx="298" cy="20" r="2" fill="#C9A864" />
                        <path d="M272 20 C 180 4, 80 4, 4 20" />
                        <path d="M272 20 C 180 36, 80 36, 4 20" />
                    </g>
                </motion.svg>

            </div>
        </motion.div>
    );
}

export default function Collection() {
  const [bottles, setBottles] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [productOffers, setProductOffers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [productimages, setProductImages] = useState([]);
  const [productvariants, setProductVariants] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          bottlesRes,
          productsRes,
          offersRes,
          productOffersRes,
          productImagesRes,
          ratingsRes,
          productVariantsRes,
        ] = await Promise.all([
          Get_bottles(),
          Get_products(),
          Get_offers(),
          Get_product_offers(),
          Get_product_images(),
          Get_all_ratings(),
          Get_all_variants(),
        ]);

        const bottlesData = Array.isArray(bottlesRes) ? bottlesRes : bottlesRes?.data ?? [];
        const productsData = Array.isArray(productsRes) ? productsRes : productsRes?.data ?? [];
        const offersData = Array.isArray(offersRes) ? offersRes : offersRes?.data ?? [];
        const productOffersData = Array.isArray(productOffersRes) ? productOffersRes : productOffersRes?.data ?? [];
        const productImagesData = Array.isArray(productImagesRes) ? productImagesRes : productImagesRes?.data ?? [];
        const ratingsData = Array.isArray(ratingsRes)
          ? ratingsRes
          : ratingsRes?.ratings ?? ratingsRes?.data ?? [];
        const productVariantsData = Array.isArray(productVariantsRes) ? productVariantsRes : productVariantsRes?.data ?? [];

        // --- per-dataset logs (full data) ---
        console.log('[Collection] bottles:', bottlesData);
        console.log('[Collection] products:', productsData);
        console.log('[Collection] offers:', offersData);
        console.log('[Collection] productOffers:', productOffersData);
        console.log('[Collection] productImages:', productImagesData);
        console.log('[Collection] ratings:', ratingsData);
        console.log('[Collection] productVariants:', productVariantsData);

        setBottles(bottlesData);
        setProducts(productsData);
        setOffers(offersData);
        setProductOffers(productOffersData);
        setProductImages(productImagesData);
        setRatings(ratingsData);
        setProductVariants(productVariantsData);

        // --- combined summary log (full data) ---
        console.log('[Collection] fetch summary:', {
          bottles: bottlesData,
          products: productsData,
          offers: offersData,
          productOffers: productOffersData,
          productImages: productImagesData,
          ratings: ratingsData,
          productVariants: productVariantsData,
        });
      } catch (error) {
        console.error('Collection fetch failed', error);
        setBottles([]);
        setProducts([]);
        setOffers([]);
        setProductOffers([]);
        setProductImages([]);
        setRatings([]);
        setProductVariants([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
        <motion.div className='w-full flex flex-col justify-center items-center gap-3 sm:gap-5'>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className='w-full flex justify-center items-center'
        >
          <TopSection
            products={products}
            productImages={productimages}
            ratings={ratings}
            productVariants={productvariants}
            offers={offers}
            productOffers={productOffers}
            bottles={bottles}
          />
        </motion.div>

        <OrnamentalDivider />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className='w-full flex justify-center items-center'
        >
          <BottomSection
            products={products}
            productImages={productimages}
            ratings={ratings}
            productVariants={productvariants}
            offers={offers}
            productOffers={productOffers}
            bottles={bottles}
          />
        </motion.div>

      </motion.div>
    </>
  );
}