import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { truncateText } from '@/lib/utils'

interface OrderWrapperProps {
    value: string,
    text: string,
    maxLength?: number
}

const OrderTooltipWrapper = ({
    value,
    text,
    maxLength = 30
}: OrderWrapperProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <p>
          {`${truncateText(value, maxLength)} `}
          {(text && maxLength < text.length) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-muted-foreground ">...</span>
              </TooltipTrigger>
              <TooltipContent side='left'  className="max-w-[500px] whitespace-normal bg-muted text-muted-foreground px-3 py-2 rounded-md shadow-lg">
                <span dangerouslySetInnerHTML={{ __html: text }} />
              </TooltipContent>
            </Tooltip>
          )}
        </p>
      </div>
    </TooltipProvider>
  )
}

export default OrderTooltipWrapper