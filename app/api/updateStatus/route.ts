import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST (
    req: Request
) {
    try {

        
        const {
            id,
            status
        } = await req.json()

        let updatedItem: any = await client.cart.update({
            where: { id },
            data: {
                status
            },
            select: {
                status: true
            }
        });


        return NextResponse.json(updatedItem)
    } catch (error) {
        console.log('[SERVER_POST - UPDATE_STATUS]', error)
        return new NextResponse('[Internal Error][UPDATE_STATUS]', {status: 500})
    }
}