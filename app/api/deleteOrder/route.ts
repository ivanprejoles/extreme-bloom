import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST (
    req: Request
) {
    try {

        const {
            id,
        } = await req.json()


        let deletedOrder: any = await client.cart.delete({
            where: { id: id.id},
        });

        return NextResponse.json(deletedOrder)
    } catch (error) {
        console.log('[SERVER_POST - DELETE_ORDER]', error)
        return new NextResponse('[Internal Error][DELETE_ORDER]', {status: 500})
    }
}