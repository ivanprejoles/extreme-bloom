import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST (
    req: Request
) {
    try {

        const {
            category
        } = await req.json()

        const newCategory = await client.category.create({
            data: {
                title: category
            }
        })

        return NextResponse.json(newCategory)
    } catch (error) {
        console.log('[SERVER_POST - ADD_CATEGORY]', error)
        return new NextResponse('[Internal Error][ADD_CATEGORY]', {status: 500})
    }
}  