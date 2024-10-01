'use client'

import { ImagesSlider } from '@/components/ui/image-slider'
import { motion } from "framer-motion";
import Link from 'next/link';
import React from 'react'

const images = [
  "/slide/home-page1.png",
  "/slide/home-page2.png",
  "/slide/home-page3.png",
];
  
const ClientSlider = () => {
  return (
    <ImagesSlider className="h-full w-full" images={images} direction="down">
        <motion.div
            initial={{
                opacity: 0,
                y: -80,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center"
        >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Extreme <br /> Bloom
        </motion.p>
        <Link href="/#item-storage">
          <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
            <span>Order now →</span>
            <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </Link>
      </motion.div>
    </ImagesSlider>
  )
}

export default ClientSlider