import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import CollectionNav from './CollectionNav';
import TotalCollection from './TotalCollection';

export default function BottomSection({ products, productImages, ratings, productVariants, offers, productOffers, bottles }) {
    const location = useLocation();
    const initialGender = location.state?.gender || 'all';
    const initialType = location.state?.type || 'all';

    const [filters, setFilters] = useState({
        type: initialType,
        gender: initialGender,
    });

    function set_nav_val(field, value) {
        setFilters(prev => ({ ...prev, [field]: value }));
    }

    return (
        <>
            <motion.div className='w-full flex flex-col lg:flex-row justify-center items-start gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 lg:px-12 py-10 sm:py-12 lg:py-16 bg-[#0a0f0c]'>

                <motion.div className='w-full lg:w-[22%] lg:sticky lg:top-24'>
                    <CollectionNav set_nav_val={set_nav_val} filters={filters} />
                </motion.div>

                <motion.div className='w-full lg:w-[78%]'>
                    <TotalCollection
                        products={products}
                        productImages={productImages}
                        ratings={ratings}
                        productVariants={productVariants}
                        offers={offers}
                        productOffers={productOffers}
                        bottles={bottles}
                        filters={filters}
                    />
                </motion.div>

            </motion.div>
        </>
    );
}
