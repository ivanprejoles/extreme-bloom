'use client'

import { useItemsStore } from '@/hooks/use-items'
import { cn, formatNumber, formatNumberNew } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { useCategoryModal } from '@/hooks/use-category-modal'
import { useUserStorage } from '@/hooks/use-storage'
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'

const CategoryItems = () => {
    const {category, items} = useItemsStore()
    const {cart, addQuantity, minusQuantity, removeItem} = useUserStorage()

  return (
    <>
        {category.map((cat, catIndex) => (
          <div className='w-full h-auto' key={catIndex}>
            <div id={cat.id} className="w-full h-[5rem] grid grid-cols-2 grid-rows-1">
              <div className="p-4">
                <h2 className="text-2xl font-bold">
                    {cat.title}
                </h2>
                <span className="text-base font-light text-slate-600">At ExtremeBloom</span>
              </div>
            </div>
            <Carousel
              opts={{
                align: "start",
              }} 
              className="w-full h-[20rem] gap-4 p-4"
            >
            <CarouselContent>
              {items[cat.id].items.map((item, itemIndex) => (
                <CarouselItem key={itemIndex} id={item.id} className="rounded-lg p-4 flex flex-col items-center relative basis sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <div  className="w-full aspect-square relative">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden" >
                      <Image 
                        src={item.imageSrc} 
                        alt={item.title} 
                        layout='fill' 
                        className="object-cover select-none w-full h-full" 
                      />
                    </div>
                    <div className="mt-2 text-start">
                      <div className="text-xl font-bold">
                        <span className="align-super text-sm">₱</span>
                        {formatNumberNew(item.price).whole}
                        <span className="align-super text-sm">{formatNumberNew(item.price).fraction}</span>
                      </div>
                      <div className="text-gray-700 text-lg leading-[18px] font-normal m-0">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.description}
                      </div>
                      <div className={cn("mt-2 text-green-600 font-medium",
                        (item.quantity > 0)
                        ? 'text-green-600'
                        : 'text-red-500'
                      )}>
                        {(item.quantity > 0) 
                          ? ('Many in stock')
                          : ('Out of stock')}
                      </div>
                    </div>
                    {cart[item.id] 
                      ? (
                        // added to cart
                      <div
                      className="right-1 top-1 absolute pr-4 bg-[#0E7D0E] text-white py-2 px-4 rounded-full line-clamp-1 text-nowrap overflow-hidden w-[140px] flex justify-center items-center"
                      >
                        {(cart[item.id].quantity > 1) 
                          ? (
                            <Button 
                              variant='green'
                              onClick={() => minusQuantity(item)}
                              className='h-[96%] aspect-square absolute top-[50%] px-2 left-[2px] rounded-l-full -translate-y-[50%]'
                            >
                              <MinusIcon />
                            </Button>) 
                          : (
                            <Button 
                              variant='green'
                              onClick={() => removeItem(item.id)}
                              className='h-[96%] aspect-square absolute top-[50%] px-2 left-[2px] rounded-l-full -translate-y-[50%]'
                            >
                              <Trash2Icon />
                            </Button>
                          )
                        }

                        {cart[item.id].quantity} ct

                        <Button
                          variant='green'
                          className='h-[96%] aspect-square absolute top-[50%] px-2 right-[2px] rounded-r-full -translate-y-[50%]'
                          onClick={() => addQuantity(item)}
                        >
                          <PlusIcon />
                        </Button>
                      </div>)
                      : (
                        //adding to cart
                      <button
                        onClick={() => addQuantity(item)}
                        className="right-1 top-1 absolute pr-4 bg-[#108910] text-white py-2 px-4 rounded-full line-clamp-1 text-nowrap overflow-hidden group w-[78px] hover:w-[140px] flex transition-all duration-300 ease-in-out"
                      >
                        + Add
                        <span 
                          className="right-1 top-1 w-0 h-auto group-hover:w-14 overflow-hidden delay-100 ml-1"
                        >
                          {'to cart'}
                        </span>
                      </button>)
                    }
                  </div>
                </CarouselItem>
              ))}
            {items[cat.id].items.length <= 0 && (
                <div className='w-full h-24 flex items-center justify-center'>
                    Item category is empty.
                </div>
            )}
            </CarouselContent>
            <CarouselPrevious className='right-14 -top-10'/>
            <CarouselNext className='-right-0 -top-10' />
          </Carousel>
        </div>
      ))}
    </>
  )
}

export default CategoryItems