import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { truncateText } from '@/lib/utils'

interface WrapperProps {
    text: string,
    maxLength?: number
}

const TooltipWrapper = ({
    text,
    maxLength = 30
}: WrapperProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <p>
          {`${truncateText(text, maxLength)} `}
          {(text && maxLength < text.length) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-muted-foreground ">...</span>
              </TooltipTrigger>
              <TooltipContent side='left' className="max-w-[300px] whitespace-normal bg-muted text-muted-foreground px-3 py-2 rounded-md shadow-lg">
                {text}
              </TooltipContent>
            </Tooltip>
          )}
        </p>
      </div>
    </TooltipProvider>
  )
}

export default TooltipWrapper