'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, formatNumber, getInitials } from '@/lib/utils'
import React from 'react'
import {OrderType} from '@/lib/types'

export interface RankedOrderProps {
  updates: OrderType[]
}

const RankedOrders = ({
  updates
}: RankedOrderProps) => {

  return (
    <>
      {
        updates.map((data, key) => (
            <div key={key} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={data.user.imageUrl} alt='User Profile' />
                    <AvatarFallback>{getInitials(data.user.email)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none line-clamp-1">
                        {data.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {formatDate(data.createdAt)}
                    </p>
                </div>
            <div className="ml-auto font-medium">
              ₱{formatNumber(data.amount)}
            </div>
          </div>
      ))}
    </>
  )
}

export default RankedOrders