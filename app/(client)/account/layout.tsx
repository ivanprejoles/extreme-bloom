import React from 'react'
import MainHeader from '@/components/general/main-header'
import { cn } from '@/lib/utils'

interface MarketLayoutProps {
    children: React.ReactNode
}

const ClientLayout = ({
children
}: MarketLayoutProps) => {
    return (
        <main className="w-full h-full overflow-y-auto relative flex flex-col">
            <div className="w-full z-[99] h-16 flex flex-row items-center gap-4 sticky top-0 left-0 bg-[#F7F5F0]">
                <MainHeader />
            </div>
            <div
                className={cn(
                    "h-full"
                )}
            >
                {children}
            </div>
        </main>
    )
}

export default ClientLayout