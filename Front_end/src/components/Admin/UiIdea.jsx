import {motion} from 'framer-motion'

export default function UiIdea(){
    return(
        <>

        <motion.div className='w-full h-[12vh] '/>

        <motion.div className='w-full h-[100vh] flex flex-row justify-center items-center'>


            {/*nav*/}
            <motion.div className='w-[30%] h-full '/>

            <motion.div className='w-[70%] h-full flex flex-col justify-center items-center'>

                <motion.div className='w-full h-[40%] bg-amber-100'>

                    {/*total product details*/}

                </motion.div>

                 <motion.div className='w-full h-[70%] bg-amber-200'>

                    {/*all products with their info , with images, and buttons like delete,edit,more details, all the products arranged in grid*/}

                </motion.div>

            </motion.div>



        </motion.div>
        
        </>
    )
}