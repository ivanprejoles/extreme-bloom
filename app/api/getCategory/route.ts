import client from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST (
    req: Request
) {
    try {
        const categories = await client.category.findMany({
            select: {
                id: true,
                title: true,
                items: {
                    select: {
                        id: true,
                        imageSrc: true,
                        title: true,
                        price: true,
                        quantity: true,
                        description: true,
                        maxOrder: true,
                        updatedAt: true
                    },
                }
            }
        })

        return NextResponse.json(categories)

    } catch (error) {
        console.log('[SERVER_POST - GET_CATEGORIES]', error)
        return new NextResponse('[Internal Error][GET_CATEGORIES]', {status: 500})
    }
}