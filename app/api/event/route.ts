import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST (
    req: Request
) {
    try {

        const {
            title,
            label,
            imageUrl
        } = await req.json()

        const products = await client.event.create({
            data: {
                description: label,
                title,
                imageSrc: imageUrl
            }
        })
        return NextResponse.json(products)
    } catch (error) {
        console.log('[SERVER_POST - ADD_PRODUCTS]', error)
        return new NextResponse('[Internal Error][ADD_PRODUCTS]', {status: 500})
    }
}  