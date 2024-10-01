import React from 'react'
import MainHeader from '@/components/general/main-header'
import ClientSideBar from '@/components/general/client-sidebar'

interface MarketLayoutProps {
    children: React.ReactNode
}

const MarketLayout = ({
children
}: MarketLayoutProps) => {
    
    return (
        <main className="w-full h-full overflow-y-auto relative flex flex-col">
            <div className="w-full z-[999] h-16 flex flex-row items-center gap-4 sticky top-0 left-0 bg-[#F7F5F0]">
                <MainHeader />
            </div>
            <ClientSideBar>
                {children}
            </ClientSideBar>
        </main>
    )
}

export default MarketLayout