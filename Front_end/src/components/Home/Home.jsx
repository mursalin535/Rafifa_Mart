import { motion } from 'framer-motion';
import Hero from './Hero';
import Our_story_overview from './Our_story_overview';
import Offer_overview from './Offer_overview';
import Collection_overview from './Collection_overview';
import Category from './Category';
import Bottles_overview from './Bottles_overview';
import Closing_massage from './Closing_massage';

export default function Home() {
  return (
    <>
      <motion.div className='w-full flex flex-col gap-20 overflow-x-hidden'>
        <motion.div className='w-full'>
          <Hero />
        </motion.div>

          <motion.div className='w-full h-[30vh] relative z-10 -mt-[100vh] flex justify-center items-center'>

              <div className='w-[60%] h-[3%] bg-amber-200 rounded-4xl'/>
        
        </motion.div>

        

        <motion.div className='w-full relative z-10 -mt-[100vh]'>
          <Our_story_overview />
        </motion.div>

        <motion.div className='w-full h-[3vh]'/>


        <motion.div>
            <Offer_overview/>
        </motion.div>

        <motion.div className='w-full h-[3vh]'/>


        <motion.div className='w-full'>
          <Collection_overview/>
        </motion.div>

        <motion.div className='w-full h-[1vh]'/>


        <motion.div className='w-full'>
          <Category/>
        </motion.div>


        <motion.div className='w-full'>
          <Bottles_overview/>
        </motion.div>


        <motion.div className='w-full'>

          <Closing_massage/>

        </motion.div>


        
      </motion.div>
    </>
  );
}