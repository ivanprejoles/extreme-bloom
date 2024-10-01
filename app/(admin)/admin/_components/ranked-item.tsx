import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

interface RankedItemsProps {
    title: string,
    description: string,
    children: React.ReactNode
}

const RankedItems = ({
    title,
    description,
    children
}: RankedItemsProps) => {
    return (
        <>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
                {children}
            </CardContent>
        </>
    )
}

export default RankedItems