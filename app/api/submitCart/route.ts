import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import {cookies} from 'next/headers';

export async function POST (
    req: Request
) {
    try {

        const {
            items,
            user,
            total
        } = await req.json()

        if (!user.id) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const cartRequest = await client.$transaction(async (prisma) => {
            const userRef = await prisma.user.findUnique({
              where: {
                emailId: user.id,
              },
              select: {
                id: true,
              },
            });
      
            if (!userRef) {
                return new NextResponse('Unauthorized', {status: 401})
            }
    
            if (items.length <= 0) {
                return new NextResponse('Undefined Item', {status: 400})
            }
      
            return await prisma.cart.create({
              data: {
                userId: userRef.id,
                items,
                amount: total
              },
              select: {
                status: true,
                items: true,
                createdAt: true,
              },
            });
        });

        return NextResponse.json(cartRequest)
    } catch (error) {
        console.error('[SERVER_POST - ADD_CART]', error)
        return new NextResponse('[Internal Error][ADD_CART]', {status: 500})
    }
}