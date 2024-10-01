import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const  Logo = () => {
  return (
    <Link className='h-full aspect-square relative rounded-md overflow-hidden' href='/'>
        <div className='w-full h-full relative'>
            <Image 
                className="object-cover"
                src='/logo.png'
                alt="Logo"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    </Link>
   )
}

export default Logo