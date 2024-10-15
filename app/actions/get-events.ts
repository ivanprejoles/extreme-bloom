import client from "@/lib/prismadb";

export async function getEvents () {
    try {
        const events = await client.event.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                imageSrc: true
            }
        })

        return events

    } catch (error) {
        console.log('[SERVER_POST - EVENTS]', error)
        return []
    }
}