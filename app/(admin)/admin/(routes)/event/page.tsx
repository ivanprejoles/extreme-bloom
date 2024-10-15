import React from 'react'
import client from '@/lib/prismadb'
import EventsTable from '../../_components/events-table'




const EventPage = async () => {

    const events = await client.event.findMany({
        select: {
            id: true,
            description: true,
            title: true,
            imageSrc: true
        }
    })
    
    return (
        <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="w-full flex flex-col items-start gap-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
                    Event Page
                </h1>
                <p className="max-w-2xl text-lg font-light text-foreground">
                    {`Monitor your event and keep it updated.`}
                </p>
            </div>
            <div className="grid gap-4">
                <EventsTable events={events} />
            </div>
        </main>
        </div>
    )
}

export default EventPage