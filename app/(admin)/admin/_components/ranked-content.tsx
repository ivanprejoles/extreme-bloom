import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdateType } from '@/lib/types'
import { formatNumber, getInitials } from '@/lib/utils'
import React from 'react'

export interface RankedContentProps {
  updates: UpdateType[]
}

const RankedContent = ({
  updates
}: RankedContentProps) => {

  return (
    <>
      { (updates.length <= 0) 
      ? 
        <div className="mt-4 flex min-h-screen flex-col items-center text-[#FEFEFE]">
          No product for now.
        </div>
      : 
        updates.map((data, key) => (
            <div key={key} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={data.imageSrc} alt={data.title} />
                    <AvatarFallback>{getInitials(data.item.title)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none line-clamp-1">
                        {data.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {data.item.title}
                    </p>
                </div>
            <div className="ml-auto font-medium">
              ₱{formatNumber(data.price)}
            </div>
          </div>
      ))}
    </>
  )
}

export default RankedContent