'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { cn } from '@/lib/utils';
import axios from 'axios'
import { itemCategoryType, itemType, useItemsStore } from '@/hooks/use-items';
import { useCategoryModal } from '@/hooks/use-category-modal';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { useToast } from '@/hooks/use-toast';

const CategorySelection = () => {
    const [updatedItems, setUpdatedItems] = useState<itemType[]>()
    const {onAddCategory, onAddItems, category, items} = useItemsStore()
    const { toast } = useToast()

    const itemCategoryDistribution = (items: any) => {
        const filteredItems: {[key: string]: itemCategoryType} = {}
        const category = items.map((item: any) => {
            filteredItems[item.id] = {items: item.items, current: 0, end: -1}
            return {
                id: item.id,
                title: item.title,
                imageSrc: item.imageSrc
            }
        })
        return {filteredItems, category}
    }

    useEffect(() => {
        const requestCategory = async () => {
            await axios.post('/api/getCategory')
                .then((response) => {
                    if(response.data.length > 0) {
                        const {filteredItems, category} = itemCategoryDistribution(response.data)
                        onAddCategory(category)
                        onAddItems(filteredItems)
                        setUpdatedItems(getItemsUpdatedTwoWeeksAgo(response.data))
                    }
                })
                .catch((error) => {
                    console.error('error: ', error)
                    toast({
                        title: 'Error Getting Categories',
                        description: 'Something went wron. Please check your network and try again.'
                    })                
                })
        }

        if (category.length <= 0) {
            requestCategory()
        }
    }, [])

    function getItemsUpdatedTwoWeeksAgo(categories: itemCategoryType[]): itemType[] {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Get the date 2 weeks ago
    
        const updatedItems: itemType[] = [];
    
        // Iterate over each category
        categories.forEach(category => {
            const filteredItems = category.items.filter(item => {
                const updatedAt = new Date(item.updatedAt);
                return updatedAt >= twoWeeksAgo;
            });
            updatedItems.push(...filteredItems); // Add filtered items to the result array
        });
    
        return updatedItems;
    }
    


    return (
        <div className="bg-white w-full h-auto pb-5 relative  rounded-t-2xl">
            <h2 className="text-2xl font-semibold py-5 px-2 md:px-10">Updated Products</h2>
            <Carousel 
                opts={{
                    align: "start",
                }} 
                className='w-full h-[13rem] relative overflow-visible'
            >
                <CarouselContent className='px-12 overflow-visible'>
                    {updatedItems && updatedItems.map((data, index) => (    
                        <CarouselItem 
                            style={{ width: 100 }} 
                            key={index} 
                            className="w-full h-[13rem] overflow-hidden p-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                        >
                            <Link href={`/#${data.id}`}>
                            <div 
                                className={cn(
                                    "w-full p-4 grid gap-2 grid-rows-3 h-full rounded-md relative overflow-hidden bg-transparent", 
                                    "cursor-pointer"
                                )}
                            >
                                <div className="relative w-full h-full  flex justify-center items-center rounded-md row-span-2 border border-[#d3d2d2]">
                                    <div className="h-full w-[80%] relative">
                                        <Image
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            fill  
                                            src={data.imageSrc|| '/no-image.png'}
                                            alt='Image Background'
                                            className='object-cover select-none'
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <p className='w-full line-clamp-2 text-center text-sm font-semibold text-ellipsis'>
                                        {data.title}
                                    </p>
                                </div>
                            </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='left-1' />
                <CarouselNext className='right-1' />
            </Carousel>
        </div>
    )
}

export default CategorySelection