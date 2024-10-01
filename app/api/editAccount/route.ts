import { NextResponse } from 'next/server';
import client from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    // Parse the request body to get the product IDs
    const {
        number,
        id,
        facebook
    } = await req.json();

    const deletedOrders = await client.user.update({
        where: {
            id
        },
        data: {
            number,
            facebook
        }
    });

    return NextResponse.json(deletedOrders);
  } catch (error) {
    console.error('[SERVER_UPDATE_ACCOUNT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
